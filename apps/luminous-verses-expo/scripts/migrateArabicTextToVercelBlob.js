// scripts/migrateArabicTextToVercelBlob.js
// eslint-disable-next-line no-undef
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') }); // Load .env.local

const { createClient } = require('@supabase/supabase-js');
const { put } = require('@vercel/blob');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const blobReadWriteToken = process.env.BLOB_READ_WRITE_TOKEN;

if (!supabaseUrl || !supabaseAnonKey || !blobReadWriteToken) {
  console.error('Supabase URL, Anon Key, or Vercel Blob Token is missing in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SUPABASE_TABLE_NAME = 'surah_all'; // User confirmed table name
const TOTAL_SURAHS = 114;
const BLOB_FOLDER_PATH = 'quran-text/arabic'; // Path within the blob store

async function migrateSurahData(surahNumber) {
  console.log(`Fetching data for Surah ${surahNumber}...`);
  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE_NAME)
      .select('aya, text') // Select only aya and text columns
      .eq('sura', surahNumber)
      .order('aya', { ascending: true });

    if (error) {
      console.error(`Error fetching data for Surah ${surahNumber} from Supabase:`, error.message);
      return { success: false, surah: surahNumber, error: error.message };
    }

    if (!data || data.length === 0) {
      console.warn(`No data found for Surah ${surahNumber}.`);
      return { success: true, surah: surahNumber, status: 'no_data' }; // Technically success, but no data to upload
    }

    // The data is already an array of { aya: number, text: string } objects
    const jsonData = data; 
    const jsonString = JSON.stringify(jsonData, null, 2); // Pretty print JSON
    const blobPathname = `${BLOB_FOLDER_PATH}/${surahNumber}.json`;

    console.log(`Uploading Surah ${surahNumber} to Vercel Blob at ${blobPathname}...`);
    const blobResult = await put(blobPathname, jsonString, {
      access: 'public',
      contentType: 'application/json; charset=utf-8', // Specify UTF-8
      addRandomSuffix: false, // Important for predictable URLs
      token: blobReadWriteToken, // Pass the token
    });

    console.log(`Successfully uploaded Surah ${surahNumber}. URL: ${blobResult.url}`);
    return { success: true, surah: surahNumber, url: blobResult.url };
  } catch (uploadError) {
    console.error(`Error processing or uploading Surah ${surahNumber}:`, uploadError.message);
    return { success: false, surah: surahNumber, error: uploadError.message };
  }
}

async function main() {
  console.log('Starting migration of Arabic text from Supabase to Vercel Blob...');
  const results = [];

  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    const result = await migrateSurahData(i);
    results.push(result);
    if (!result.success && result.error !== 'no_data') {
      // Optional: Stop on first critical error or collect all results
      // console.error(`Critical error on Surah ${i}, stopping migration.`);
      // break; 
    }
    // Optional: Add a small delay if needed to avoid rate limiting, though unlikely for 114 operations.
    // await new Promise(resolve => setTimeout(resolve, 100)); 
  }

  console.log('\nMigration process completed.');
  const successfulUploads = results.filter(r => r.success && r.url);
  const noDataSurahs = results.filter(r => r.status === 'no_data');
  const failedUploads = results.filter(r => !r.success && r.error);

  console.log(`\nSuccessfully uploaded ${successfulUploads.length} Surahs.`);
  if (noDataSurahs.length > 0) {
    console.log(`${noDataSurahs.length} Surahs had no data in Supabase: ${noDataSurahs.map(s => s.surah).join(', ')}`);
  }
  if (failedUploads.length > 0) {
    console.error(`\nFailed to upload ${failedUploads.length} Surahs:`);
    failedUploads.forEach(fail => {
      console.error(`- Surah ${fail.surah}: ${fail.error}`);
    });
  }
}

main().catch(err => {
  console.error('Unhandled error in migration script:', err);
});