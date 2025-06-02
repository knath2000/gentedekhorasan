"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@libsql/client");
async function handler(req, res) {
    try {
        console.log('=== SCHEMA VERIFICATION ===');
        const libsql = (0, client_1.createClient)({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });
        // Check existing tables
        const tables = await libsql.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);
        console.log('Existing tables:', tables.rows);
        // Check if user_bookmarks table exists
        const userBookmarksTable = await libsql.execute(`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='user_bookmarks';
    `);
        console.log('user_bookmarks table schema:', userBookmarksTable.rows);
        return res.status(200).json({
            status: 'success',
            tables: tables.rows.map(row => row.name),
            userBookmarksSchema: userBookmarksTable.rows[0]?.sql || 'Table does not exist'
        });
    }
    catch (error) {
        console.error('Schema verification failed:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
