import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '../../prisma/generated/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Test query
    const count = await prisma.userBookmark.count();
    console.log('Current bookmark count:', count);
    
    // Test schema
    const tableInfo = await prisma.$queryRaw`PRAGMA table_info(user_bookmarks)`;
    console.log('Table schema:', tableInfo);
    
    return res.status(200).json({
      status: 'success',
      connection: 'ok',
      bookmarkCount: count,
      schema: tableInfo
    });
    
  } catch (error: any) {
    console.error('Database test failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      code: error.code
    });
  } finally {
    await prisma.$disconnect();
  }
}