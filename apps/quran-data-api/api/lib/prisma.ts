import { PrismaNeon } from '@prisma/adapter-neon';
import 'websocket-polyfill'; // Añadir polyfill para Edge Functions
import { PrismaClient } from '../generated/prisma';

const adapter = new PrismaNeon({
  connectionString: process.env.NEON_DATABASE_URL
})

console.log('NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? 'Configured' : 'Not Configured');
console.log('NEON_DATABASE_URL value (first 10 chars):', process.env.NEON_DATABASE_URL?.substring(0, 10));

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}