"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@libsql/client"); // Import createClient
const adapter_libsql_1 = require("@prisma/adapter-libsql");
const client_2 = require("../../prisma/generated/client");
const globalForPrisma = globalThis;
// Asegurarse de que las variables de entorno no sean undefined
const LIBSQL_URL = process.env.LIBSQL_URL;
const LIBSQL_AUTH_TOKEN = process.env.LIBSQL_AUTH_TOKEN;
if (!LIBSQL_URL) {
    throw new Error('LIBSQL_URL is not defined in environment variables');
}
// Create the libSQL driver instance
const driver = (0, client_1.createClient)({
    url: LIBSQL_URL,
    authToken: LIBSQL_AUTH_TOKEN, // authToken puede ser undefined si no es necesario
});
const adapter = new adapter_libsql_1.PrismaLibSQL(driver); // Pass the driver instance to the adapter
exports.prisma = globalForPrisma.prisma ??
    new client_2.PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
