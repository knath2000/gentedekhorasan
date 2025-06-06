"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const serverless_1 = require("@neondatabase/serverless");
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("@prisma/client");
const ws_1 = __importDefault(require("ws"));
// Required for the Neon serverless driver to work in Node.js environments
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const globalForPrisma = globalThis;
// Create the Neon adapter with the connection config
const connectionString = process.env.DATABASE_URL;
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient({
    adapter,
});
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
