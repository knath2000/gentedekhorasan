// api/get-metadata.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool as PgPool } from 'pg';

// Initialize the connection pool (same as other API endpoints)
const dbPool = new PgPool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 10000,
});

dbPool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client in pool (get-metadata)', err);
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[API] Request received: ${req.url}`);
  console.log(`[API] Query parameters: ${JSON.stringify(req.query)}`);
  console.log(`[API] Environment variables available: ${Object.keys(process.env).filter(key => !key.includes('KEY') && !key.includes('SECRET')).join(', ')}`);
  
  const { type } = req.query;
  let client;
  
  try {
    client = await dbPool.connect();
    console.log("[API] Successfully connected to database");
    
    // Handle different metadata requests
    if (type === 'surah-list') {
      console.log("[API] Executing surah-list query");
      const result = await client.query(
        'SELECT number, arabic_name AS name, transliteration AS tname, ' +
        'english_name AS ename, ayas, revelation_type AS type, chronological_order AS "order", rukus ' +
        'FROM quran_surahs ORDER BY number'
      );
      console.log(`[API] Query returned ${result.rows.length} rows`);
      return res.status(200).json(result.rows);
    }
    else if (type === 'sajdas') {
      // Add similar logging for sajdas if needed
      const result = await client.query(
        'SELECT sajda_id, surah_number, ayah_number, type FROM quran_sajdas ORDER BY surah_number, ayah_number'
      );
      return res.status(200).json(result.rows);
    }
    else if (type === 'navigation-indices') {
      // Add query for navigation indices if stored in DB
      // Add logging if implemented
      return res.status(501).json({ error: 'Not implemented' });
    }
    
    return res.status(400).json({ error: 'Invalid metadata type requested' });
  } catch (err: any) {
    console.error(`[API] Error fetching metadata (${type}):`, err);
    return res.status(500).json({ error: 'Database error', message: err.message });
  } finally {
    if (client) {
      console.log("[API] Releasing database connection");
      client.release();
    }
  }
}