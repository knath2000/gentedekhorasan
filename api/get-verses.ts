const { VercelRequest: _VercelRequest, VercelResponse: _VercelResponse } = require('@vercel/node');
const { Pool: PgPool } = require('pg');

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
  console.error('Unexpected error on idle client in pool (get-verses)', err);
});

module.exports = async function handler(req: typeof _VercelRequest, res: typeof _VercelResponse) {
  console.log(`[API] Request received: ${req.url}`);
  console.log(`[API] Query parameters: ${JSON.stringify(req.query)}`);
  console.log(`[API] Environment variables available: ${Object.keys(process.env).filter(key => !key.includes('KEY') && !key.includes('SECRET')).join(', ')}`);

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  const surahQuery = req.query.surah;

  if (!surahQuery || typeof surahQuery !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "surah" query parameter.' });
  }

  const surah = parseInt(surahQuery, 10);

  if (isNaN(surah) || surah < 1 || surah > 114) { // Basic validation
    return res.status(400).json({ error: 'Invalid "surah" number. Must be between 1 and 114.' });
  }

  let client;
  try {
    client = await dbPool.connect();
    console.log("[API] Successfully connected to database");
    const query = 'SELECT id, sura, aya, text FROM quran_text WHERE sura = $1 ORDER BY aya ASC';
    console.log(`[API] Executing query: ${query} with params: [${surah}]`);
    const result = await client.query(query, [surah]);
    console.log(`[API] Query returned ${result.rows.length} rows`);
    
    // Map to the expected client-side Verse structure (without translation yet)
    const verses = result.rows.map((row: { id: string; sura: string; aya: string; text: string }) => ({
      id: parseInt(row.id, 10),
      surahId: parseInt(row.sura, 10),
      numberInSurah: parseInt(row.aya, 10),
      text: row.text,
    }));
    
    return res.status(200).json(verses);
  } catch (err: any) {
    console.error(`[API] Detailed error in get-verses for Surah ${surah}:`, {
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
      console.log("[API] Releasing database connection");
      client.release();
    }
  }
}