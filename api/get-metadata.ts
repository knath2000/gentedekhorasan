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
  // Set CORS headers for all responses from this function
  // For development, '*' is okay. For production, restrict to your frontend domain.
  // Example: res.setHeader('Access-Control-Allow-Origin', 'https://your-app-domain.com');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log(`[API-Metadata] Request received: ${req.url}`);
  console.log(`[API-Metadata] Query parameters: ${JSON.stringify(req.query)}`);
  console.log(`[API-Metadata] Environment variables available: ${Object.keys(process.env).filter(key => !key.includes('KEY') && !key.includes('SECRET')).join(', ')}`);
  
  const { type } = req.query;
  let client;
  
  try {
    client = await dbPool.connect();
    console.log("[API] Successfully connected to database");
    
    // Handle different metadata requests
    if (type === 'surah-list') {
      console.log("[API-Metadata] Executing surah-list query");
      const result = await client.query(
        'SELECT number, arabic_name AS name, transliteration AS tname, ' +
        'english_name AS ename, ayas, revelation_type AS type, chronological_order AS "order", rukus ' +
        'FROM quran_surahs ORDER BY number'
      );
      console.log(`[API-Metadata] Query returned ${result.rows.length} rows for surah-list`);
      return res.status(200).json(result.rows);
    }
    else if (type === 'sajdas') {
      console.log("[API-Metadata] Executing sajdas query");
      const result = await client.query(
        'SELECT sajda_id, surah_number, ayah_number, type FROM quran_sajdas ORDER BY surah_number, ayah_number'
      );
      console.log(`[API-Metadata] Query returned ${result.rows.length} rows for sajdas`);
      return res.status(200).json(result.rows);
    }
    else if (type === 'navigation-indices') {
      console.log("[API-Metadata] navigation-indices requested (Not Implemented in DB yet)");
      // Add query for navigation indices if stored in DB
      return res.status(501).json({ error: 'Not implemented' });
    }
    
    console.warn(`[API-Metadata] Invalid metadata type requested: ${type}`);
    return res.status(400).json({ error: 'Invalid metadata type requested' });
  } catch (err: any) {
    console.error(`[API-Metadata] Error fetching metadata (${type}):`, err);
    return res.status(500).json({ error: 'Database error', message: err.message });
  } finally {
    if (client) {
      console.log("[API-Metadata] Releasing database connection");
      client.release();
    }
  }
}