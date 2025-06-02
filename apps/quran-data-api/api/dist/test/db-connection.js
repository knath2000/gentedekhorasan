"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@libsql/client");
async function handler(req, res) {
    try {
        console.log('=== DIRECT TURSO CONNECTION TEST ===');
        const libsql = (0, client_1.createClient)({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });
        // Test basic connection
        const result = await libsql.execute('SELECT 1 as test');
        console.log('Basic query result:', result.rows);
        // Test user_bookmarks table
        try {
            const countResult = await libsql.execute('SELECT COUNT(*) as count FROM user_bookmarks');
            console.log('Bookmark count:', countResult.rows[0]);
            return res.status(200).json({
                status: 'success',
                connection: 'ok',
                bookmarkCount: countResult.rows[0].count,
                database: 'TursoDB via LibSQL Direct'
            });
        }
        catch (tableError) {
            console.log('user_bookmarks table does not exist:', tableError.message);
            return res.status(200).json({
                status: 'partial_success',
                connection: 'ok',
                tableExists: false,
                message: 'Connection works but user_bookmarks table needs to be created',
                error: tableError.message
            });
        }
    }
    catch (error) {
        console.error('Connection test failed:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}
