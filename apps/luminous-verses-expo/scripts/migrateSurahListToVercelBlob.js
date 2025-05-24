// scripts/migrateSurahListToVercelBlob.js
// eslint-disable-next-line no-undef
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');
const { put } = require('@vercel/blob');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const blobReadWriteToken = process.env.BLOB_READ_WRITE_TOKEN;

if (!supabaseUrl || !supabaseAnonKey || !blobReadWriteToken) {
  console.error('Supabase URL, Anon Key, or Vercel Blob Token is missing in .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SUPABASE_TABLE_NAME = 'surahlist'; // Table name for the list of Surahs
const BLOB_FILE_PATH = 'quran-data/surahlist.json'; // Single file for the entire list

async function migrateSurahList() {
  console.log(`Fetching data from Supabase table '${SUPABASE_TABLE_NAME}'...`);
  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE_NAME)
      .select('number, name, englishName, englishNameTranslation, numberOfAyahs, revelationType')
      .order('number', { ascending: true });

    if (error) {
      console.error(`Error fetching data from '${SUPABASE_TABLE_NAME}' from Supabase:`, error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`No data found in '${SUPABASE_TABLE_NAME}'. Nothing to upload.`);
      return { success: true, status: 'no_data' };
    }

    // The data is already an array of Surah-like objects
    const jsonString = JSON.stringify(data, null, 2); // Pretty print JSON

    console.log(`Uploading surah list to Vercel Blob at ${BLOB_FILE_PATH}...`);
    const blobResult = await put(BLOB_FILE_PATH, jsonString, {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      token: blobReadWriteToken,
    });

    console.log(`Successfully uploaded surah list. URL: ${blobResult.url}`);
    return { success: true, url: blobResult.url };
  } catch (uploadError) {
    console.error(`Error processing or uploading surah list:`, uploadError.message);
    throw uploadError; // Re-throw to be caught by main
  }
}

async function main() {
  console.log('Starting migration of surahlist from Supabase to Vercel Blob...');
  try {
    const result = await migrateSurahList();
    if (result.success) {
      if (result.status === 'no_data') {
        console.log('Migration finished: No data was found in the Supabase table.');
      } else {
        console.log('Migration finished successfully!');
      }
    } else {
      console.error('Migration failed.');
    }
  } catch (err) {
    console.error('Unhandled error in migration script:', err.message);
    process.exitCode = 1; // Indicate failure
  }
}

main();