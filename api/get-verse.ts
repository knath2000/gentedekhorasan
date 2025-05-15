const { VercelRequest, VercelResponse } = require('@vercel/node');
const { Pool } = require('pg');

// Initialize the connection pool
// Ensure NEON_DATABASE_URL is set in your Vercel project's environment variables
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon DB
  },
  // Recommended pool configuration for serverless environments
  max: 1, // Adjust as needed, but keep low for serverless to manage connections
  idleTimeoutMillis: 5000, // Shorter timeout for serverless
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client in pool (get-verse)', err);
});

module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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
    client = await pool.connect();
    const query = 'SELECT id, sura, aya, text FROM quran_text WHERE sura = $1 AND aya = $2 LIMIT 1';
    const result = await client.query(query, [surah, ayah]);

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
    console.error(`Detailed error in get-verse for Surah ${surah}, Ayah ${ayah}:`, {
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
      client.release();
    }
  }
}