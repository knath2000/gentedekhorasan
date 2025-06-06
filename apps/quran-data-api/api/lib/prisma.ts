import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '../../prisma/generated/client';

export function createPrismaClient(): PrismaClient {
  const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

  if (!TURSO_DATABASE_URL) {
    throw new Error('TURSO_DATABASE_URL is not defined in environment variables');
  }

  const driver = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSQL(driver);
  return new PrismaClient({ adapter });
}

export const prisma = createPrismaClient();