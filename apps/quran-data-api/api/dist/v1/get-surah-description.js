"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@libsql/client");
// Asegurarse de que las variables de entorno no sean undefined
const LIBSQL_URL = process.env.LIBSQL_URL;
const LIBSQL_AUTH_TOKEN = process.env.LIBSQL_AUTH_TOKEN;
if (!LIBSQL_URL) {
    throw new Error('LIBSQL_URL is not defined in environment variables');
}
const db = (0, client_1.createClient)({
    url: LIBSQL_URL,
    authToken: LIBSQL_AUTH_TOKEN,
});
exports.default = async (request, response) => {
    // Añadir encabezados CORS para permitir solicitudes desde cualquier origen
    response.setHeader('Access-Control-Allow-Origin', '*'); // Permitir cualquier origen
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Manejar solicitudes OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }
    try {
        const { surahId } = request.query;
        if (!surahId) {
            return response.status(400).json({ error: 'surahId is required' });
        }
        const result = await db.execute({
            sql: 'SELECT description FROM surah_descriptions WHERE surah_id = ?',
            args: [Number(surahId)],
        });
        if (result.rows.length > 0) {
            response.status(200).json({ description: result.rows[0].description });
        }
        else {
            response.status(404).json({ error: 'Description not found for this surahId' });
        }
    }
    catch (error) {
        console.error('Error fetching surah description:', error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
};
