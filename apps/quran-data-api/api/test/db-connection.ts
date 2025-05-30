import { createClient } from '@libsql/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('=== DIRECT TURSO CONNECTION TEST ===');
    
    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    
    // Test basic connection
    const result = await libsql.execute('SELECT 1 as test');
    console.log('Basic query result:', result.rows);
    
    // Test user_bookmarks table
    try {
      const countResult = await libsql.execute('SELECT COUNT(*) as count FROM user_bookmarks');
      console.log('Bookmark count:', countResult.rows[0]);
      
      return res.status(200).json({
        status: 'success',
        connection: 'ok',
        bookmarkCount: countResult.rows[0].count,
        database: 'TursoDB via LibSQL Direct'
      });
    } catch (tableError: any) {
      console.log('user_bookmarks table does not exist:', tableError.message);
      
      return res.status(200).json({
        status: 'partial_success',
        connection: 'ok',
        tableExists: false,
        message: 'Connection works but user_bookmarks table needs to be created',
        error: tableError.message
      });
    }
    
  } catch (error: any) {
    console.error('Connection test failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}