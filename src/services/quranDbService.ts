/*
import Constants from 'expo-constants';
import { Pool } from 'pg';
import { Verse } from '../types/quran'; // Assuming Verse type is defined here

// Retrieve the connection string from environment variables
// For Expo, you might set this in app.json under "extra" or use a .env file with a library like react-native-dotenv
// Ensure NEON_DATABASE_URL is set in your environment or app configuration.
// Example: "postgresql://quran_owner:npg_YSdwHth5Ef0r@ep-odd-term-a82e3a4w-pooler.eastus2.azure.neon.tech/quran?sslmode=require"
const connectionString = process.env.NEON_DATABASE_URL || Constants.expoConfig?.extra?.NEON_DATABASE_URL;


if (!connectionString) {
  console.error("NEON_DATABASE_URL is not defined. Please set it in your environment or app.json (extra.NEON_DATABASE_URL).");
  // Potentially throw an error or use a fallback if appropriate for your app's lifecycle
  // For now, we'll let it proceed, but queries will fail if it's truly missing.
}

export const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Neon DB connections
  },
  // Recommended pool configuration for serverless environments like Vercel/Expo Go
  max: 10, // Max number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 20000, // How long to wait for a connection to be established
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client in pool', err);
  // Consider if process.exit(-1) is appropriate for your app, usually not for frontend services
});

/**
 * Fetches all verses for a given Surah from the Neon database.
 * @param surahNumber The number of the Surah (1-based).
 * @returns A Promise resolving to an array of Verse objects (without translations).
 * /
export async function getVersesBySurahFromDb(surahNumber: number): Promise<Omit<Verse, 'translation'>[]> {
  if (!connectionString) {
    console.error("Database connection string is not configured. Cannot fetch verses.");
    throw new Error("Database connection string is not configured.");
  }
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT id, sura as "surahId", aya as "numberInSurah", text
      FROM quran_text
      WHERE sura = $1
      ORDER BY aya ASC;
    `;
    const res = await client.query(query, [surahNumber]);
    return res.rows.map(row => ({
      id: parseInt(row.id, 10), 
      surahId: parseInt(row.surahId, 10),
      numberInSurah: parseInt(row.numberInSurah, 10),
      text: row.text,
    }));
  } catch (err) {
    console.error(`Error fetching verses for Surah ${surahNumber} from DB:`, err);
    throw err; // Re-throw to be handled by the caller
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Fetches a single verse by Surah and Ayah number from the Neon database.
 * @param surahNumber The number of the Surah (1-based).
 * @param ayahNumber The number of the Ayah within the Surah.
 * @returns A Promise resolving to a Verse object (without translation) or null if not found.
 * /
export async function getVerseFromDb(surahNumber: number, ayahNumber: number): Promise<Omit<Verse, 'translation'> | null> {
  if (!connectionString) {
    console.error("Database connection string is not configured. Cannot fetch verse.");
    throw new Error("Database connection string is not configured.");
  }
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT id, sura as "surahId", aya as "numberInSurah", text
      FROM quran_text
      WHERE sura = $1 AND aya = $2
      LIMIT 1;
    `;
    const res = await client.query(query, [surahNumber, ayahNumber]);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        id: parseInt(row.id, 10),
        surahId: parseInt(row.surahId, 10),
        numberInSurah: parseInt(row.numberInSurah, 10),
        text: row.text,
      };
    }
    return null;
  } catch (err) {
    console.error(`Error fetching verse ${surahNumber}:${ayahNumber} from DB:`, err);
    throw err; // Re-throw to be handled by the caller
  } finally {
    if (client) {
      client.release();
    }
  }
}
*/