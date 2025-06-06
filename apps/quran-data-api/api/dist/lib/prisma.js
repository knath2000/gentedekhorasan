"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.createPrismaClient = createPrismaClient;
const client_1 = require("@libsql/client");
const adapter_libsql_1 = require("@prisma/adapter-libsql");
const client_2 = require("../../prisma/generated/client");
function createPrismaClient() {
    const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
    const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
    if (!TURSO_DATABASE_URL) {
        throw new Error('TURSO_DATABASE_URL is not defined in environment variables');
    }
    const driver = (0, client_1.createClient)({
        url: TURSO_DATABASE_URL,
        authToken: TURSO_AUTH_TOKEN,
    });
    const adapter = new adapter_libsql_1.PrismaLibSQL(driver);
    return new client_2.PrismaClient({ adapter });
}
exports.prisma = createPrismaClient();
