import { createClient } from '@libsql/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('=== CREATING TABLES ===');
    
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    // Create user_bookmarks table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS user_bookmarks (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        surahId INTEGER NOT NULL,
        verseNumber INTEGER NOT NULL,
        verseText TEXT NOT NULL,
        surahName TEXT NOT NULL,
        translation TEXT NOT NULL,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(userId, surahId, verseNumber)
      );
    `;

    await libsql.execute(createTableSQL);
    console.log('user_bookmarks table created successfully');

    // Verify table creation
    const tableInfo = await libsql.execute(`
      PRAGMA table_info(user_bookmarks);
    `);
    
    console.log('Table structure:', tableInfo.rows);

    return res.status(200).json({
      status: 'success',
      message: 'user_bookmarks table created',
      tableStructure: tableInfo.rows
    });
    
  } catch (error: any) {
    console.error('Table creation failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}