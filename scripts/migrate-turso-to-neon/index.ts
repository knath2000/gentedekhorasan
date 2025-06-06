import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Pool } from 'pg';
import { from as copyFrom } from 'pg-copy-streams';
import { Readable } from 'stream';

// Load environment variables from .env file
dotenv.config();

// TursoDB connection details from environment variables
const TURSO_URL = process.env.TURSO_DATABASE_URL || '';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || '';

// NeonDB connection details from environment variables
const NEON_URL = process.env.DATABASE_URL || '';

// Initialize TursoDB client
const tursoClient = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Initialize NeonDB client
const neonPool = new Pool({
  connectionString: NEON_URL,
  ssl: {
    rejectUnauthorized: false, // Required for some hosted PostgreSQL environments
  },
});

// Function to log messages to console and a log file
async function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  await fs.appendFile(path.join(__dirname, 'migration.log'), `[${timestamp}] ${message}\n`);
}

// Function to get table names from TursoDB
async function getTursoTables() {
  const result = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
  return result.rows.map(row => row.name as string);
}

// Function to get table schema from TursoDB
async function getTursoTableSchema(tableName: string) {
  const result = await tursoClient.execute(`PRAGMA table_info(${tableName});`);
  return result.rows;
}

// Function to get data from TursoDB table in batches
async function getTursoData(tableName: string, limit: number = 1000, offset: number = 0) {
  const result = await tursoClient.execute({
    sql: `SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${offset};`,
    args: []
  });
  return result.rows;
}

// Function to get table names from NeonDB
async function getNeonTables() {
  const result = await neonPool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
  return result.rows.map(row => row.table_name as string);
}

// Function to convert potential timestamp values to PostgreSQL format
function convertToPostgresTimestamp(value: any): any {
  if (typeof value === 'number' && value > 1000000000000) { // Likely a millisecond timestamp
    return new Date(value).toISOString();
  } else if (typeof value === 'string' && value.match(/^\d{13}$/)) { // Stringified millisecond timestamp
    return new Date(parseInt(value, 10)).toISOString();
  }
  return value;
}

// Function to check if a table is Quran-related
function isQuranRelatedTable(tableName: string): boolean {
  const quranRelatedPrefixes = ['quran_', 'en_', 'surah_', 'user_bookmarks', '_prisma_migrations'];
  return quranRelatedPrefixes.some(prefix => tableName.startsWith(prefix));
}

// Custom Readable stream for TursoDB data
class TursoStream extends Readable {
  private tableName: string;
  private offset: number;
  private batchSize: number;
  private totalRecords: number;
  private columnNames: string[];
  private getTursoData: (tableName: string, limit: number, offset: number) => Promise<any[]>;

  constructor(tableName: string, totalRecords: number, columnNames: string[], getTursoData: (tableName: string, limit: number, offset: number) => Promise<any[]>, batchSize: number = 100) {
    super({ objectMode: true });
    this.tableName = tableName;
    this.offset = 0;
    this.batchSize = batchSize;
    this.totalRecords = totalRecords;
    this.columnNames = columnNames;
    this.getTursoData = getTursoData;
  }

  async _read() {
    if (this.offset >= this.totalRecords) {
      this.push(null); // No more data
      return;
    }

    try {
      const rows = await this.getTursoData(this.tableName, this.batchSize, this.offset);
      if (rows.length === 0) {
        this.push(null); // No more data
        return;
      }

      // Format data for COPY command (tab-separated values)
      const dataToCopy = rows.map((row: { [key: string]: any }) => 
        this.columnNames.map(colName => {
          const value = convertToPostgresTimestamp(row[colName]);
          return value === null || value === undefined ? '\\N' : String(value).replace(/\t/g, '\\t').replace(/\n/g, '\\n');
        }).join('\t')
      ).join('\n') + '\n'; // Add newline at the end of each row and final newline

      this.push(dataToCopy);
      this.offset += rows.length;
      await log(`Reading batch of ${rows.length} records for ${this.tableName}. Total read: ${this.offset} of ${this.totalRecords}.`);
    } catch (error: any) {
      this.emit('error', error);
    }
  }
}

// Function to migrate data for a specific table using COPY
async function migrateTable(tableName: string) {
  await log(`Starting migration for table: ${tableName}`);
  
  const client = await neonPool.connect();
  try {
    // Get total count from TursoDB
    const countResult = await tursoClient.execute(`SELECT COUNT(*) as count FROM ${tableName};`);
    const totalRecords = countResult.rows[0].count as number;
    await log(`Total records to migrate in ${tableName}: ${totalRecords}`);
    
    // Get schema from TursoDB to dynamically get column names
    const schema = await getTursoTableSchema(tableName);
    const columnNames = schema.map(col => col.name as string);
    const columnsForCopy = columnNames.join(', ');

    // Check if table exists in NeonDB
    const neonTables = await getNeonTables();
    if (!neonTables.includes(tableName)) {
      await log(`Table ${tableName} does not exist in NeonDB. Creating it now.`);
      let createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
      const columns = schema.map(col => {
        const name = col.name as string;
        let type = 'TEXT'; // Default to TEXT for simplicity; adjust based on actual type if needed
        if (col.type === 'INTEGER') type = 'INTEGER';
        if (col.type === 'REAL') type = 'REAL';
        if (col.type === 'TIMESTAMP' || name.toLowerCase().includes('date') || name.toLowerCase().includes('time')) type = 'TIMESTAMP';
        if (col.pk === 1) type += ' PRIMARY KEY';
        if (col.notnull === 1 && col.dflt_value === null) type += ' NOT NULL';
        if (col.dflt_value !== null) type += ` DEFAULT ${col.dflt_value}`;
        return `${name} ${type}`;
      });
      createTableSQL += columns.join(', ');
      createTableSQL += ');';
      await client.query(createTableSQL);
      await log(`Table ${tableName} created in NeonDB.`);
    } else {
      await log(`Table ${tableName} already exists in NeonDB.`);
    }

    // Create a readable stream from TursoDB data
    const tursoStream = new TursoStream(tableName, totalRecords, columnNames, getTursoData);
    // Create a writable stream for COPY command
    const copyStream = client.query(copyFrom(`COPY ${tableName} (${columnsForCopy}) FROM STDIN WITH (FORMAT text, DELIMITER '\t')`));

    await new Promise<void>((resolve, reject) => {
      tursoStream.pipe(copyStream)
        .on('end', () => {
          log(`Finished piping data for ${tableName}.`);
          resolve();
        })
        .on('error', (error) => {
          log(`Error during COPY for ${tableName}: ${error.message}`);
          reject(error);
        });
    });

    await log(`Completed migration for table: ${tableName} with ${totalRecords} records migrated.`);

  } catch (error: any) {
    await log(`Migration failed for table ${tableName}: ${error.message}`);
  } finally {
    client.release();
  }
}

// Main migration function
async function migrate() {
  await log('Starting migration from TursoDB to NeonDB...');
  
  try {
    // Connect to NeonDB
    await neonPool.connect();
    await log('Connected to NeonDB successfully.');
    
    // Get tables from TursoDB
    const tursoTables = await getTursoTables();
    await log(`Found tables in TursoDB: ${tursoTables.join(', ')}`);
    
    // Filter to migrate only Quran-related tables
    const quranTables = tursoTables.filter(table => isQuranRelatedTable(table));
    await log(`Quran-related tables to migrate: ${quranTables.join(', ')}`);
    
    // Migrate each Quran-related table
    for (const table of quranTables) {
      if (table !== 'sqlite_sequence') { // Skip system tables
        await migrateTable(table);
      }
    }
    
    await log('Migration completed successfully for Quran-related data.');
  } catch (error: any) {
    await log(`Migration failed: ${error.message}`);
  } finally {
    // Close connections
    await tursoClient.close();
    await neonPool.end();
    await log('Database connections closed.');
  }
}

// Run migration
migrate().catch(error => {
  console.error('Unexpected error:', error);
  fs.appendFile(path.join(__dirname, 'migration.log'), `[${new Date().toISOString()}] Unexpected error: ${error.message}\n`);
});