import { createClient, EdgeConfigClient } from '@vercel/edge-config';
import { Pool } from 'pg'; // Assuming 'pg' is available in the environment this service runs

// Ensure NEON_DATABASE_URL and EDGE_CONFIG are set in the environment
// For client-side (Expo app), direct DB connection is not typical.
// This service, if running client-side, would need API endpoints for DB operations.
// Assuming this service might be part of a backend layer or called by one for DB access,
// or the environment (e.g., Next.js with API routes) allows it.

let pool: Pool | null = null;

// Initialize pool only if DB URL is available (might not be on pure client-side)
if (process.env.NEON_DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon DB
    },
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client in pool (quranMetadataService)', err);
  });
} else {
  console.warn("NEON_DATABASE_URL not found. Database fallback in quranMetadataService will not be available.");
}

const edgeConfigConnectionString = process.env.EDGE_CONFIG;
let edgeConfigClient: EdgeConfigClient | undefined;

if (edgeConfigConnectionString) {
  try {
    edgeConfigClient = createClient(edgeConfigConnectionString);
  } catch (error) {
    console.error("Failed to create Edge Config client:", error);
    console.warn("Edge Config functionality in quranMetadataService will not be available.");
  }
} else {
  console.warn("EDGE_CONFIG connection string not found. Edge Config functionality will not be available.");
}

// Define types based on the expected structure from Edge Config and DB
// These should align with what the conversion script produces and the DB schema

interface SurahBasicInfo {
  number: number;
  name: string; // Arabic name
  tname: string; // Transliterated name
  ename: string; // English name
  ayas: number;
  type: string; // Revelation type
  order?: number; // Chronological order (optional in basic info)
  rukus?: number; // Ruku count (optional in basic info)
}

// Interface for the overall structure expected from Edge Config for "quranMetadata"
interface QuranEdgeConfigData {
  surahBasicInfo?: SurahBasicInfo[];
  navigationIndices?: NavigationIndices;
  // Add other top-level keys if your edge-config-data.json has more
}

interface SajdaVerse {
  sajda_id?: number; // Or whatever the primary key is
  surah_number: number;
  ayah_number: number;
  type?: string; // 'recommended' or 'obligatory'
}


// Fallback function using database
async function getBasicSurahListFromDb(): Promise<SurahBasicInfo[] | null> {
  if (!pool) {
    console.error("Database pool not initialized. Cannot fetch Surah list from DB.");
    return null;
  }
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT number, arabic_name AS name, transliteration AS tname, ' +
      'english_name AS ename, ayas, revelation_type AS type, chronological_order AS order, rukus ' +
      'FROM quran_surahs ORDER BY number'
    );
    // Ensure the returned structure matches SurahBasicInfo
    return res.rows.map(row => ({
        number: parseInt(row.number, 10),
        name: row.name,
        tname: row.tname,
        ename: row.ename,
        ayas: parseInt(row.ayas, 10),
        type: row.type,
        order: parseInt(row.order, 10),
        rukus: parseInt(row.rukus, 10),
    }));
  } catch (dbError) {
    console.error("Error fetching basic surah list from DB:", dbError);
    return null; // Or throw error
  }
  finally {
    client.release();
  }
}

// Fast-path function using Edge Config
export async function getBasicSurahList(): Promise<SurahBasicInfo[] | null> {
  if (!edgeConfigClient) {
    console.warn("Edge Config client not available, attempting DB fallback for getBasicSurahList.");
    return getBasicSurahListFromDb();
  }
  try {
    // The plan stores data under a top-level key, e.g., "quranMetadata"
    // And then "surahBasicInfo" within that.
    // Adjust the key if your Edge Config setup is different.
    const metadata = await edgeConfigClient.get('quranMetadata') as QuranEdgeConfigData | undefined;

    if (metadata && typeof metadata === 'object' && metadata.surahBasicInfo) {
      return metadata.surahBasicInfo;
    }
    console.warn('surahBasicInfo not found or metadata is not in expected format in Edge Config, attempting DB fallback.');
    return getBasicSurahListFromDb();
  } catch (error) {
    console.error('Edge Config error in getBasicSurahList, falling back to database:', error);
    return getBasicSurahListFromDb();
  }
}


// Complex queries go directly to database
// This function, if called from client-side, should be an API endpoint.
export async function getSajdaVerses(): Promise<SajdaVerse[] | null> {
  if (!pool) {
    console.error("Database pool not initialized. Cannot fetch Sajda verses.");
    return null;
  }
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT sajda_id, surah_number, ayah_number, type FROM quran_sajdas ORDER BY surah_number, ayah_number'
    );
    return res.rows as SajdaVerse[];
  } catch (dbError) {
    console.error("Error fetching Sajda verses from DB:", dbError);
    return null; // Or throw error
  }
  finally {
    client.release();
  }
}

// Example of how to get navigation indices (e.g., Juz starts) from Edge Config
interface NavigationIndexItem {
  surah: number;
  aya: number;
}

interface NavigationIndices {
  juzStarts?: Record<string, NavigationIndexItem>;
  pageStarts?: Record<string, NavigationIndexItem>;
  // Add other indices as needed
}

export async function getNavigationIndices(): Promise<NavigationIndices | null> {
  if (!edgeConfigClient) {
    console.warn("Edge Config client not available for getNavigationIndices.");
    // Potentially fall back to DB if these are also stored there and critical
    return null;
  }
  try {
    const metadata = await edgeConfigClient.get('quranMetadata') as QuranEdgeConfigData | undefined;
    if (metadata && typeof metadata === 'object' && metadata.navigationIndices) {
      return metadata.navigationIndices;
    }
    console.warn('navigationIndices not found or metadata is not in expected format in Edge Config.');
    return null;
  } catch (error) {
    console.error('Edge Config error in getNavigationIndices:', error);
    return null;
  }
}