import { createClient } from '@libsql/client';
import { VercelRequest, VercelResponse } from '@vercel/node';

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
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