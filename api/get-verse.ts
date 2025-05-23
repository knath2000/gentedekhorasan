import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool as PgPool } from 'pg';

// Initialize the connection pool
// Ensure NEON_DATABASE_URL is set in your Vercel project's environment variables
const dbPool = new PgPool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon DB
  },
  // Recommended pool configuration for serverless environments
  max: 1, // Adjust as needed, but keep low for serverless to manage connections
  idleTimeoutMillis: 5000, // Shorter timeout for serverless
  connectionTimeoutMillis: 10000,
});

dbPool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client in pool (get-verse)', err);
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

  console.log(`[API-GetVerse] Request received: ${req.url}`);
  console.log(`[API-GetVerse] Query parameters: ${JSON.stringify(req.query)}`);
  console.log(`[API-GetVerse] Environment variables available: ${Object.keys(process.env).filter(key => !key.includes('KEY') && !key.includes('SECRET')).join(', ')}`);

  if (req.method !== 'GET') {
    // res.setHeader('Allow', ['GET']); // Allow header is less relevant
    return res.status(405).end('Method Not Allowed');
  }

  const surahQuery = req.query.surah;
  const ayahQuery = req.query.ayah || req.query.aya; // Allow 'aya' or 'ayah'

  if (!surahQuery || typeof surahQuery !== 'string' || !ayahQuery || typeof ayahQuery !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "surah" or "ayah" query parameters.' });
  }

  const surah = parseInt(surahQuery, 10);
  const ayah = parseInt(ayahQuery, 10);

  if (isNaN(surah) || surah < 1 || surah > 114) {
    return res.status(400).json({ error: 'Invalid "surah" number. Must be between 1 and 114.' });
  }
  if (isNaN(ayah) || ayah < 1) { // Max ayah varies per surah, basic check here
    return res.status(400).json({ error: 'Invalid "ayah" number. Must be a positive integer.' });
  }

  let client;
  try {
    client = await dbPool.connect();
    console.log("[API-GetVerse] Successfully connected to database");
    const query = 'SELECT id, sura, aya, text FROM quran_text WHERE sura = $1 AND aya = $2 LIMIT 1';
    console.log(`[API-GetVerse] Executing query: ${query} with params: [${surah}, ${ayah}]`);
    const result = await client.query(query, [surah, ayah]);
    console.log(`[API-GetVerse] Query returned ${result.rows.length} rows`);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Verse ${surah}:${ayah} not found.` });
    }

    const row = result.rows[0];
    const verse = {
      id: parseInt(row.id, 10),
      surahId: parseInt(row.sura, 10),
      numberInSurah: parseInt(row.aya, 10),
      text: row.text,
    };
    
    return res.status(200).json(verse);
  } catch (err: any) {
    console.error(`[API-GetVerse] Detailed error in get-verse for Surah ${surah}, Ayah ${ayah}:`, {
      message: err.message,
      code: err.code, // PG error code, if available
      stack: err.stack,
      errno: err.errno, // System error number, if relevant
      syscall: err.syscall // System call, if relevant
    });
    return res.status(500).json({
      error: 'Database error',
      details: err.message,
      code: err.code // Optionally send code to client, be cautious with sensitive info
    });
  } finally {
    if (client) {
      console.log("[API-GetVerse] Releasing database connection");
      client.release();
    }
  }
}