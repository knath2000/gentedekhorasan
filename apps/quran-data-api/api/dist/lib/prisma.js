"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_libsql_1 = require("@prisma/adapter-libsql");
const client_1 = require("../../prisma/generated/client");
// No necesitamos createClient de @libsql/client si pasamos la URL directamente al adaptador
const globalForPrisma = globalThis;
// Asegurarse de que las variables de entorno no sean undefined
const LIBSQL_URL = process.env.LIBSQL_URL;
const LIBSQL_AUTH_TOKEN = process.env.LIBSQL_AUTH_TOKEN;
if (!LIBSQL_URL) {
    throw new Error('LIBSQL_URL is not defined in environment variables');
}
const adapter = new adapter_libsql_1.PrismaLibSQL({
    url: LIBSQL_URL,
    authToken: LIBSQL_AUTH_TOKEN, // authToken puede ser undefined si no es necesario
});
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
