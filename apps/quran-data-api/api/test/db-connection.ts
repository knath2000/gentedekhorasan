import { PrismaLibSQL } from '@prisma/adapter-libsql';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '../../prisma/generated/client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('=== TURSO CONNECTION TEST ===');
    console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL?.substring(0, 50) + '...');
    console.log('TURSO_AUTH_TOKEN present:', !!process.env.TURSO_AUTH_TOKEN);
    
    // Create LibSQL client
    // Create Prisma client with adapter
    const adapter = new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    const prisma = new PrismaClient({ adapter });
    
    // Test connection
    await prisma.$connect();
    console.log('TursoDB connected successfully');
    
    // Test query
    const count = await prisma.userBookmark.count();
    console.log('Current bookmark count:', count);
    
    await prisma.$disconnect();
    
    return res.status(200).json({
      status: 'success',
      connection: 'ok',
      bookmarkCount: count,
      database: 'TursoDB via LibSQL'
    });
    
  } catch (error: any) {
    console.error('TursoDB test failed:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      code: error.code
    });
  }
}