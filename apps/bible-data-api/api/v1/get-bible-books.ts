import { createClient } from '@libsql/client';
import { VercelRequest, VercelResponse } from '@vercel/node';

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
const ALLOWED_CORS_ORIGIN = process.env.ALLOWED_CORS_ORIGIN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers dynamically
  if (ALLOWED_CORS_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_CORS_ORIGIN);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    return res.status(500).json({ error: 'Database configuration is missing.' });
  }

  const client = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute('SELECT * FROM bible_books ORDER BY id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch Bible books.' });
  } finally {
    client.close();
  }
}