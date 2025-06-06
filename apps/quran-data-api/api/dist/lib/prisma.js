"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@libsql/client");
const adapter_libsql_1 = require("@prisma/adapter-libsql");
const client_2 = require("../../prisma/generated/client");
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ??
    new client_2.PrismaClient({
        adapter: new adapter_libsql_1.PrismaLibSQL((0, client_1.createClient)({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        })),
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
