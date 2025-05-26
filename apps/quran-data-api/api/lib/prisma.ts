import { PrismaClient } from '../generated/prisma';

console.log('NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? 'Configured' : 'Not Configured');
console.log('NEON_DATABASE_URL value (first 10 chars):', process.env.NEON_DATABASE_URL?.substring(0, 10));

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}