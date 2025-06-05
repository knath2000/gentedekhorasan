import * as fs from 'fs/promises';
import * as path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { BibleVerse } from './types';

const LOCAL_DB_PATH = './output/local-bible.db';
const BATCH_SIZE = 500;

async function main() {
  console.log('Starting local Bible database creation...');

  // Ensure output directory exists
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });

  // Open the database connection
  const db = await open({
    filename: LOCAL_DB_PATH,
    driver: sqlite3.Database
  });

  console.log('Creating bible_verses table...');
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bible_verses (
      id TEXT PRIMARY KEY,
      orgId TEXT,
      bibleId TEXT,
      bookId TEXT,
      chapterId TEXT,
      reference TEXT,
      verseNumber TEXT,
      content TEXT
    );
  `);
  console.log('Table created successfully.');

  console.log('Reading JSON data...');
  const jsonPath = path.resolve(__dirname, '../../extract-bible-data/output/bsb_new_testament_verses.json');
  const jsonData = await fs.readFile(jsonPath, 'utf-8');
  const verses: BibleVerse[] = JSON.parse(jsonData);
  console.log(`Found ${verses.length} verses to import.`);

  if (verses.length === 0) {
    console.log('No verses to import. Exiting.');
    await db.close();
    return;
  }

  console.log('Starting batch insert into local database...');
  await db.exec('BEGIN TRANSACTION;');
  const stmt = await db.prepare(
    'INSERT OR REPLACE INTO bible_verses (id, orgId, bibleId, bookId, chapterId, reference, verseNumber, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  for (let i = 0; i < verses.length; i++) {
    const verse = verses[i];
    await stmt.run(
      verse.id,
      verse.orgId,
      verse.bibleId,
      verse.bookId,
      verse.chapterId,
      verse.reference,
      verse.verseNumber,
      verse.content
    );
    if ((i + 1) % BATCH_SIZE === 0) {
      console.log(`Inserted ${i + 1} of ${verses.length} verses...`);
    }
  }

  await stmt.finalize();
  await db.exec('COMMIT;');
  
  console.log(`\nLocal database created successfully.`);
  console.log(`Total verses inserted: ${verses.length}`);

  // **FIX:** Set WAL mode and checkpoint before closing
  console.log('Setting database to WAL mode for Turso import...');
  await db.exec('PRAGMA journal_mode=WAL;');
  await db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
  console.log('WAL mode set and checkpointed.');

  await db.close();

  console.log('\n---');
  console.log('NEXT STEP: Push the local database to Turso.');
  console.log('Run the following command in your terminal:');
  console.log('\x1b[36m%s\x1b[0m', `turso db import ${LOCAL_DB_PATH}`);
  console.log('---');
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
});