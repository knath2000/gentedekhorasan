import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool as PgPool } from 'pg';

// Initialize the connection pool
// Ensure NEON_DATABASE_URL is set in your Vercel project's environment variables
const dbPool = new PgPool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon DB
  },
  max: 1, 
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 10000,
});

dbPool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client in pool (get-translation-verses)', err);
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`[API-GetTranslationVerses] Request received: ${req.url}`);
  console.log(`[API-GetTranslationVerses] Query parameters: ${JSON.stringify(req.query)}`);

  if (req.method !== 'GET') {
    // res.setHeader('Allow', ['GET']); // Allow header is less relevant
    return res.status(405).end('Method Not Allowed');
  }

  const surahQuery = req.query.surah;
  const translationKey = req.query.translator; // e.g., "en.yusufali"

  if (!surahQuery || typeof surahQuery !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "surah" query parameter.' });
  }

  // For now, we only have 'en_yusufali'. In the future, this could select different tables.
  if (!translationKey || translationKey !== 'en.yusufali') {
    return res.status(400).json({ error: 'Missing or invalid "translator" query parameter. Currently only "en.yusufali" is supported.' });
  }
  const tableName = "en_yusufali"; // Hardcoded for now, can be dynamic later

  const surah = parseInt(surahQuery, 10);

  if (isNaN(surah) || surah < 1 || surah > 114) {
    return res.status(400).json({ error: 'Invalid "surah" number. Must be between 1 and 114.' });
  }

  let client;
  try {
    client = await dbPool.connect();
    console.log("[API-GetTranslationVerses] Successfully connected to database");
    // Note: The 'en_yusufali' table uses 'index' as the global verse ID.
    const query = `SELECT "index", sura, aya, text FROM ${tableName} WHERE sura = $1 ORDER BY aya ASC`;
    console.log(`[API-GetTranslationVerses] Executing query: ${query} with params: [${surah}]`);
    const result = await client.query(query, [surah]);
    console.log(`[API-GetTranslationVerses] Query returned ${result.rows.length} rows for Surah ${surah}`);
    
    // Map to a structure that includes the translation text
    // The client-side Verse type has 'id', 'surahId', 'numberInSurah', 'translation'
    const verses = result.rows.map((row: { index: string; sura: string; aya: string; text: string }) => ({
      id: parseInt(row.index, 10), // Global verse ID from 'index' column
      surahId: parseInt(row.sura, 10),
      numberInSurah: parseInt(row.aya, 10),
      translation: row.text, // The actual translation
    }));
    
    return res.status(200).json(verses);
  } catch (err: any) {
    console.error(`[API-GetTranslationVerses] Detailed error in get-translation-verses for Surah ${surah}:`, {
      message: err.message,
      code: err.code,
      stack: err.stack,
      errno: err.errno,
      syscall: err.syscall
    });
    return res.status(500).json({
      error: 'Database error while fetching translation',
      details: err.message,
      code: err.code
    });
  } finally {
    if (client) {
      console.log("[API-GetTranslationVerses] Releasing database connection");
      client.release();
    }
  }
}