// scripts/migrateYusufaliToVercelBlob.js
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

const SUPABASE_TABLE_NAME = 'yusufali'; // Table name for Yusuf Ali translations
const TOTAL_SURAHS = 114;
const BLOB_FOLDER_PATH = 'quran-data/translation/yusufali'; // Path within the blob store

async function migrateTranslationData(surahNumber) {
  console.log(`Fetching Yusuf Ali translation for Surah ${surahNumber}...`);
  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE_NAME)
      .select('aya, text') // Select only aya and text columns
      .eq('sura', surahNumber)
      .order('aya', { ascending: true });

    if (error) {
      console.error(`Error fetching translation for Surah ${surahNumber} from Supabase:`, error.message);
      return { success: false, surah: surahNumber, error: error.message };
    }

    if (!data || data.length === 0) {
      console.warn(`No translation data found for Surah ${surahNumber}.`);
      // Upload an empty array to signify no translations for this surah if that's desired
      // or handle as a success with 'no_data' status.
      // For consistency with how the app might expect a file, let's upload an empty array.
      const emptyJsonString = JSON.stringify([], null, 2);
      const emptyBlobPathname = `${BLOB_FOLDER_PATH}/${surahNumber}.json`;
      await put(emptyBlobPathname, emptyJsonString, {
        access: 'public',
        contentType: 'application/json; charset=utf-8',
        addRandomSuffix: false,
        token: blobReadWriteToken,
      });
      console.log(`Uploaded empty translation file for Surah ${surahNumber} as no data was found.`);
      return { success: true, surah: surahNumber, status: 'no_data_uploaded_empty' };
    }

    // The data is already an array of { aya: number, text: string } objects
    const jsonData = data; 
    const jsonString = JSON.stringify(jsonData, null, 2); // Pretty print JSON
    const blobPathname = `${BLOB_FOLDER_PATH}/${surahNumber}.json`;

    console.log(`Uploading Yusuf Ali translation for Surah ${surahNumber} to Vercel Blob at ${blobPathname}...`);
    const blobResult = await put(blobPathname, jsonString, {
      access: 'public',
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      token: blobReadWriteToken,
    });

    console.log(`Successfully uploaded Yusuf Ali translation for Surah ${surahNumber}. URL: ${blobResult.url}`);
    return { success: true, surah: surahNumber, url: blobResult.url };
  } catch (uploadError) {
    console.error(`Error processing or uploading Yusuf Ali translation for Surah ${surahNumber}:`, uploadError.message);
    return { success: false, surah: surahNumber, error: uploadError.message };
  }
}

async function main() {
  console.log('Starting migration of Yusuf Ali translations from Supabase to Vercel Blob...');
  const results = [];

  for (let i = 1; i <= TOTAL_SURAHS; i++) {
    const result = await migrateTranslationData(i);
    results.push(result);
    if (!result.success && result.status !== 'no_data_uploaded_empty') {
      // Optional: Stop on first critical error
    }
    // Optional: Add a small delay
    // await new Promise(resolve => setTimeout(resolve, 100)); 
  }

  console.log('\nMigration process for Yusuf Ali translations completed.');
  const successfulUploads = results.filter(r => r.success && r.url);
  const noDataUploadedEmpty = results.filter(r => r.status === 'no_data_uploaded_empty');
  const failedUploads = results.filter(r => !r.success && r.error);

  console.log(`\nSuccessfully uploaded translations for ${successfulUploads.length} Surahs.`);
  if (noDataUploadedEmpty.length > 0) {
    console.log(`Uploaded empty translation files for ${noDataUploadedEmpty.length} Surahs (no data in Supabase): ${noDataUploadedEmpty.map(s => s.surah).join(', ')}`);
  }
  if (failedUploads.length > 0) {
    console.error(`\nFailed to upload translations for ${failedUploads.length} Surahs:`);
    failedUploads.forEach(fail => {
      console.error(`- Surah ${fail.surah}: ${fail.error}`);
    });
  }
}

main().catch(err => {
  console.error('Unhandled error in migration script:', err);
  process.exitCode = 1;
});