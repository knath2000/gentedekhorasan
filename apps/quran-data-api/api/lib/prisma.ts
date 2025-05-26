import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma';

const adapter = new PrismaNeon({
  connectionString: process.env.NEON_DATABASE_URL
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}