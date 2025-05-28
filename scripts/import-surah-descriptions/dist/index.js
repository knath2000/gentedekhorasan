import { createClient } from "@libsql/client";
import fs from "fs/promises";
import path from "node:path";
const TURSO_DB_URL = "libsql://quran-turso-db-blackflagkhorasan.aws-us-east-1.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDg0NjQ1MDQsImlkIjoiZDNmZDEwNTEtNTQ3OS00ZWVlLTk5MzktMTQ1YzlhYzkyZWUxIiwicmlkIjoiZGZhOTdlNWItMTZjOS00ZjE0LWI3MDctZTI0ZDBiYmZhMTdmIn0.RsEd_QNV_D1WTLx1jcaPkSG4TXNvD6noqs_eeZaYA3_tfuDsjDdWZZbHDBS5rBuiUNQO7ejTHjXs1EaWQzRnCA"; // Reemplazar con el token real proporcionado por el usuario
const db = createClient({
    url: TURSO_DB_URL,
    authToken: TURSO_AUTH_TOKEN
});
const upsertQuery = `
  INSERT INTO surah_descriptions (surah_id, description, updated_at)
  VALUES (?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(surah_id) DO UPDATE SET description=excluded.description, updated_at=CURRENT_TIMESTAMP;
`;
async function main() {
    try {
        const jsonFilePath = path.join(process.cwd(), '../generate-surah-descriptions/dist/surah_descriptions.json');
        const data = JSON.parse(await fs.readFile(jsonFilePath, "utf-8"));
        if (!Array.isArray(data) || data.length === 0) {
            console.error("El archivo JSON está vacío o no es un array válido.");
            process.exit(1);
        }
        try {
            console.log("Creando tabla 'surah_descriptions' si no existe...");
            await db.execute("CREATE TABLE IF NOT EXISTS surah_descriptions (surah_id INTEGER PRIMARY KEY, description TEXT NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
            console.log("Tabla verificada/creada.");
        }
        catch (tableErr) {
            console.error("Error al crear/verificar la tabla:", tableErr);
            process.exit(1);
        }
        console.log(`Iniciando upsert batch para ${data.length} descripciones de suras...`);
        for (const { surah_id, description } of data) {
            try {
                await db.execute(upsertQuery, [surah_id, description]);
            }
            catch (err) {
                console.error(`Error al insertar/actualizar surah_id ${surah_id}:`, err);
                // No hacer process.exit(1) aquí para intentar continuar con otras suras
            }
        }
        console.log("Proceso de upsert completado. Verificando resultados...");
        console.log("Validando post-inserción...");
        const { rows } = await db.execute("SELECT COUNT(*) as count FROM surah_descriptions");
        const rowCount = rows[0].count;
        console.log(`Número de filas en la tabla: ${rowCount}`);
        if (rowCount === data.length) {
            console.log("Validación exitosa: El número de filas coincide con el número de descripciones importadas.");
        }
        else {
            console.warn("Advertencia: El número de filas no coincide con el número de descripciones importadas.");
        }
    }
    catch (error) {
        console.error("Error general en el script de importación:", error);
        process.exit(1);
    }
    finally {
        // Cerrar la conexión a la base de datos si es necesario (depende del cliente libsql)
        // Para @libsql/client, no hay un método explícito 'close' para el cliente creado con createClient
        // La conexión se gestiona internamente o se cierra cuando el proceso termina.
    }
}
main();
