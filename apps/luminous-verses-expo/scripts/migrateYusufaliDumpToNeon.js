// scripts/migrateYusufaliDumpToNeon.js
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { Pool } = require('pg');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const dumpFilePath = path.join(os.homedir(), 'Downloads', 'dump4.sql');

const dropTableSql = `DROP TABLE IF EXISTS en_yusufali;`;

const createTableSql = `
CREATE TABLE IF NOT EXISTS en_yusufali (
  "index" INTEGER PRIMARY KEY,
  sura INTEGER NOT NULL DEFAULT 0,
  aya INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL
);
`;

async function main() {
  if (!process.env.NEON_DATABASE_URL) {
    console.error("Error: NEON_DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  if (!fs.existsSync(dumpFilePath)) {
    console.error(`Error: SQL dump file not found at ${dumpFilePath}`);
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  let client;
  try {
    client = await pool.connect();
    console.log('Successfully connected to Neon database.');

    await client.query('BEGIN');
    console.log('Transaction started.');

    console.log('Dropping existing en_yusufali table (if any)...');
    await client.query(dropTableSql);
    console.log('Table en_yusufali dropped (if it existed).');

    console.log('Creating en_yusufali table...');
    await client.query(createTableSql);
    console.log('Table en_yusufali created successfully.');

    console.log(`Reading SQL dump file from: ${dumpFilePath}`);
    const dumpContent = fs.readFileSync(dumpFilePath, 'utf-8');
    const lines = dumpContent.split('\n');

    let totalRowsInserted = 0;
    const insertPromises = [];
    
    let inInsertBlock = false;
    let valuesBuffer = "";

    console.log('Parsing and inserting data...');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Corrected condition to match "INSERT INTO `en_yusufali`" case-insensitively for the table name part
      if (trimmedLine.toUpperCase().startsWith('INSERT INTO `EN_YUSUFALI`')) { // CORRECTED LINE
        console.log(`DEBUG: Found INSERT INTO line ${i + 1}: ${trimmedLine.substring(0,100)}...`);
        inInsertBlock = true;
        const valuesIndex = trimmedLine.toUpperCase().indexOf('VALUES');
        if (valuesIndex !== -1) {
            valuesBuffer = trimmedLine.substring(valuesIndex + 'VALUES'.length).trimStart();
        } else {
            valuesBuffer = ""; 
            console.warn(`DEBUG: INSERT INTO line ${i+1} did not contain VALUES keyword on the same line. This might be okay if VALUES is on the next line.`);
        }
      } else if (inInsertBlock) {
        // If valuesBuffer is empty and this line contains VALUES, it means VALUES was on a new line.
        if (valuesBuffer === "" && trimmedLine.toUpperCase().startsWith('VALUES')) {
            valuesBuffer = trimmedLine.substring('VALUES'.length).trimStart();
        } else {
            valuesBuffer += " " + trimmedLine; // Append current line to buffer, ensure space
        }
      }

      if (inInsertBlock && trimmedLine.endsWith(';')) {
        console.log(`DEBUG: End of INSERT block detected at line ${i + 1}.`);
        inInsertBlock = false;
        
        const cleanValuesBuffer = valuesBuffer.endsWith(';') ? valuesBuffer.slice(0, -1).trim() : valuesBuffer.trim();
        
        console.log(`DEBUG: Attempting to parse buffer (length ${cleanValuesBuffer.length}): "${cleanValuesBuffer.substring(0, 300)}..."`);

        const tupleRegex = /\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'((?:[^']|\\')*?)'\s*\)/g;
        let match;
        let tuplesInBlock = 0;
        
        while ((match = tupleRegex.exec(cleanValuesBuffer)) !== null) {
          tuplesInBlock++;
          const index = parseInt(match[1], 10);
          const sura = parseInt(match[2], 10);
          const aya = parseInt(match[3], 10);
          const text = match[4].replace(/\\'/g, "'"); 

          insertPromises.push(
            client.query('INSERT INTO en_yusufali ("index", sura, aya, text) VALUES ($1, $2, $3, $4)', [index, sura, aya, text])
              .then(() => {
                totalRowsInserted++;
              })
              .catch(err => {
                console.error(`Error inserting row: INDEX=${index}, SURA=${sura}, AYA=${aya}. Text (start): "${text.substring(0,50)}...". Error: ${err.message}`);
              })
          );

          if (insertPromises.length >= 200) { 
            await Promise.all(insertPromises.splice(0, insertPromises.length)); 
            console.log(`${totalRowsInserted} rows inserted so far...`);
          }
        }
        
        if (tuplesInBlock === 0 && cleanValuesBuffer.length > 5) { 
            console.warn(`DEBUG: Regex found no tuples in buffer. Buffer (first 300 chars): "${cleanValuesBuffer.substring(0,300)}..."`);
        } else {
            console.log(`DEBUG: Regex found ${tuplesInBlock} tuples in this INSERT block.`);
        }
        valuesBuffer = ""; 
      }
    }

    if (insertPromises.length > 0) {
      await Promise.all(insertPromises);
    }
    
    console.log(`Total rows inserted: ${totalRowsInserted}`);
    if (totalRowsInserted === 0 && dumpContent.toUpperCase().includes('INSERT INTO `EN_YUSUFALI`')) {
        console.warn("Warning: No rows were inserted, but INSERT statements for en_yusufali seem to be present in the dump.");
    }
    await client.query('COMMIT');
    console.log('Transaction committed. Data migration potentially successful.');

  } catch (error) {
    console.error('Error during migration:', error);
    if (client) {
      try {
        console.log('Attempting to rollback transaction...');
        await client.query('ROLLBACK');
        console.log('Transaction rolled back.');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      }
    }
  } finally {
    if (client) {
      client.release();
      console.log('Database client released.');
    }
    await pool.end();
    console.log('Database pool ended.');
  }
}

main().catch(err => {
  console.error("Unhandled error in main function:", err);
  process.exit(1);
});