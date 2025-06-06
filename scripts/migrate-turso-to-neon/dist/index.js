"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@libsql/client");
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const pg_1 = require("pg");
// Load environment variables from .env file
dotenv_1.default.config();
// TursoDB connection details from environment variables
const TURSO_URL = process.env.TURSO_DATABASE_URL || '';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || '';
// NeonDB connection details from environment variables
const NEON_URL = process.env.DATABASE_URL || '';
// Initialize TursoDB client
const tursoClient = (0, client_1.createClient)({
    url: TURSO_URL,
    authToken: TURSO_AUTH_TOKEN,
});
// Initialize NeonDB client
const neonPool = new pg_1.Pool({
    connectionString: NEON_URL,
    ssl: {
        rejectUnauthorized: false, // Required for some hosted PostgreSQL environments
    },
});
// Function to log messages to console and a log file
async function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    await fs.appendFile(path.join(__dirname, 'migration.log'), `[${timestamp}] ${message}\n`);
}
// Function to get table names from TursoDB
async function getTursoTables() {
    const result = await tursoClient.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
    return result.rows.map(row => row.name);
}
// Function to get table schema from TursoDB
async function getTursoTableSchema(tableName) {
    const result = await tursoClient.execute(`PRAGMA table_info(${tableName});`);
    return result.rows;
}
// Function to get data from TursoDB table in batches
async function getTursoData(tableName, limit = 1000, offset = 0) {
    const result = await tursoClient.execute({
        sql: `SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${offset};`,
        args: []
    });
    return result.rows;
}
// Function to get table names from NeonDB
async function getNeonTables() {
    const result = await neonPool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;");
    return result.rows.map(row => row.table_name);
}
// Function to migrate data for a specific table
async function migrateTable(tableName) {
    await log(`Starting migration for table: ${tableName}`);
    // Get total count from TursoDB
    const countResult = await tursoClient.execute(`SELECT COUNT(*) as count FROM ${tableName};`);
    const totalRecords = countResult.rows[0].count;
    await log(`Total records to migrate in ${tableName}: ${totalRecords}`);
    // Check if table exists in NeonDB
    const neonTables = await getNeonTables();
    if (!neonTables.includes(tableName)) {
        await log(`Table ${tableName} does not exist in NeonDB. Creating it now.`);
        // Get schema from TursoDB and create table in NeonDB
        const schema = await getTursoTableSchema(tableName);
        let createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (`;
        const columns = schema.map(col => {
            const name = col.name;
            let type = 'TEXT'; // Default to TEXT for simplicity; adjust based on actual type if needed
            if (col.type === 'INTEGER')
                type = 'INTEGER';
            if (col.type === 'REAL')
                type = 'REAL';
            if (col.pk === 1)
                type += ' PRIMARY KEY';
            if (col.notnull === 1 && col.dflt_value === null)
                type += ' NOT NULL';
            if (col.dflt_value !== null)
                type += ` DEFAULT ${col.dflt_value}`;
            return `${name} ${type}`;
        });
        createTableSQL += columns.join(', ');
        createTableSQL += ');';
        await neonPool.query(createTableSQL);
        await log(`Table ${tableName} created in NeonDB.`);
    }
    else {
        await log(`Table ${tableName} already exists in NeonDB.`);
    }
    // Migrate data in batches
    const batchSize = 1000;
    let offset = 0;
    let migratedRecords = 0;
    while (offset < totalRecords) {
        const rows = await getTursoData(tableName, batchSize, offset);
        if (rows.length === 0)
            break;
        // Prepare insert statement for NeonDB
        const keys = Object.keys(rows[0]);
        const columns = keys.join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const insertSQL = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING;`;
        // Insert each row
        for (const row of rows) {
            const values = keys.map(key => row[key]);
            try {
                await neonPool.query(insertSQL, values);
                migratedRecords++;
            }
            catch (error) {
                await log(`Error inserting record into ${tableName}: ${error.message}`);
            }
        }
        offset += batchSize;
        await log(`Migrated ${migratedRecords} of ${totalRecords} records for ${tableName}.`);
    }
    await log(`Completed migration for table: ${tableName} with ${migratedRecords} records migrated.`);
}
// Main migration function
async function migrate() {
    await log('Starting migration from TursoDB to NeonDB...');
    try {
        // Connect to NeonDB
        await neonPool.connect();
        await log('Connected to NeonDB successfully.');
        // Get tables from TursoDB
        const tursoTables = await getTursoTables();
        await log(`Found tables in TursoDB: ${tursoTables.join(', ')}`);
        // Migrate each table
        for (const table of tursoTables) {
            if (table !== 'sqlite_sequence') { // Skip system tables
                await migrateTable(table);
            }
        }
        await log('Migration completed successfully.');
    }
    catch (error) {
        await log(`Migration failed: ${error.message}`);
    }
    finally {
        // Close connections
        await tursoClient.close();
        await neonPool.end();
        await log('Database connections closed.');
    }
}
// Run migration
migrate().catch(error => {
    console.error('Unexpected error:', error);
    fs.appendFile(path.join(__dirname, 'migration.log'), `[${new Date().toISOString()}] Unexpected error: ${error.message}\n`);
});
