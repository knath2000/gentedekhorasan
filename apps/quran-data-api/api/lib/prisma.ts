import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma';
// No necesitamos createClient de @libsql/client si pasamos la URL directamente al adaptador

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Asegurarse de que las variables de entorno no sean undefined
const LIBSQL_URL = process.env.LIBSQL_URL;
const LIBSQL_AUTH_TOKEN = process.env.LIBSQL_AUTH_TOKEN;

if (!LIBSQL_URL) {
  throw new Error('LIBSQL_URL is not defined in environment variables');
}

const adapter = new PrismaLibSQL({
  url: LIBSQL_URL,
  authToken: LIBSQL_AUTH_TOKEN, // authToken puede ser undefined si no es necesario
});

export const prisma = globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}