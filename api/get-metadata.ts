// api/get-metadata.ts
const { VercelRequest, VercelResponse } = require('@vercel/node');
const { Pool } = require('pg');

// Initialize the connection pool (same as other API endpoints)
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client in pool (get-metadata)', err);
});

module.exports = async function handler(req: typeof VercelRequest, res: typeof VercelResponse) {
  const { type } = req.query;
  
  let client;
  try {
    client = await pool.connect();
    
    // Handle different metadata requests
    if (type === 'surah-list') {
      const result = await client.query(
        'SELECT number, arabic_name AS name, transliteration AS tname, ' +
        'english_name AS ename, ayas, revelation_type AS type, chronological_order AS "order", rukus ' +
        'FROM quran_surahs ORDER BY number'
      );
      return res.status(200).json(result.rows);
    } 
    else if (type === 'sajdas') {
      const result = await client.query(
        'SELECT sajda_id, surah_number, ayah_number, type FROM quran_sajdas ORDER BY surah_number, ayah_number'
      );
      return res.status(200).json(result.rows);
    }
    else if (type === 'navigation-indices') {
      // Add query for navigation indices if stored in DB
      return res.status(501).json({ error: 'Not implemented' });
    }
    
    return res.status(400).json({ error: 'Invalid metadata type requested' });
  } catch (err: any) {
    console.error(`Error fetching metadata (${type}):`, err);
    return res.status(500).json({ error: 'Database error', message: err.message });
  } finally {
    if (client) client.release();
  }
}