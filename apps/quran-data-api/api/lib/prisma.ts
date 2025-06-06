import { createClient } from '@libsql/client'; // Import createClient
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '../../prisma/generated/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Asegurarse de que las variables de entorno no sean undefined
const LIBSQL_URL = process.env.LIBSQL_URL;
const LIBSQL_AUTH_TOKEN = process.env.LIBSQL_AUTH_TOKEN;

if (!LIBSQL_URL) {
  throw new Error('LIBSQL_URL is not defined in environment variables');
}

// Create the libSQL driver instance
const driver = createClient({
  url: LIBSQL_URL,
  authToken: LIBSQL_AUTH_TOKEN, // authToken puede ser undefined si no es necesario
});

const adapter = new PrismaLibSQL(driver); // Pass the driver instance to the adapter

export const prisma = globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}