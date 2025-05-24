/* eslint-env node */
// scripts/migrateAudioToVercelBlob.js
// This script uploads audio files from a local folder to Vercel Blob.
// Ensure BLOB_READ_WRITE_TOKEN is in your environment variables.
// To run: node scripts/migrateAudioToVercelBlob.js

const { put } = require('@vercel/blob');
const fs = require('fs').promises; // Using promises API for async file reading
const path = require('path');
const { Buffer } = require('buffer');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Configuration
const TOTAL_SURAHS = 114;
const VERSES_PER_SURAH = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 
  54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 
  49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 
  44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 
  26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 
  6, 3, 5, 4, 5, 6
];

// LOCAL SOURCE DIRECTORY - Relative to the project root
const LOCAL_SOURCE_BASE_DIR = path.resolve(process.cwd(), 'downloads/000_versebyverse');
// This should match the prefix in src/lib/blobClient.ts
const AUDIO_PATH_PREFIX_IN_BLOB = 'quran-audio/alafasy128/'; 

async function readAndUploadFile(surahNumber, verseNumber) {
  const surahStr = surahNumber.toString().padStart(3, '0');
  const verseStr = verseNumber.toString().padStart(3, '0');
  const filename = `${surahStr}${verseStr}.mp3`;
  
  const localFilePath = path.join(LOCAL_SOURCE_BASE_DIR, filename);
  const blobPathname = `${AUDIO_PATH_PREFIX_IN_BLOB}${filename}`;

  console.log(`Processing Surah ${surahNumber}, Verse ${verseNumber} (${filename})...`);

  try {
    console.log(`  Reading from local path: ${localFilePath}`);
    // Check if file exists before attempting to read
    try {
      await fs.access(localFilePath);
    } catch (accessError) {
      console.error(`  Error: Local file not found at ${localFilePath}`);
      return null; // Skip this file
    }

    const fileBuffer = await fs.readFile(localFilePath);
    console.log(`  Read ${filename} (${(fileBuffer.byteLength / 1024).toFixed(2)} KB) from local disk.`);

    console.log(`  Uploading ${filename} to Vercel Blob at ${blobPathname}`);
    const blobResult = await put(blobPathname, fileBuffer, { // fs.readFile returns a Buffer
      access: 'public',
      contentType: 'audio/mpeg',
      addRandomSuffix: false, // Keep the exact filename for predictable URLs
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    
    console.log(`  Uploaded ${filename} successfully. URL: ${blobResult.url}`);
    return blobResult;
  } catch (error) {
    console.error(`  Error processing ${filename}:`, error.message);
    if (error.response) { 
        try {
            const errorBody = await error.response.text();
            console.error('  Error response body:', errorBody);
        } catch (e) { /* ignore */ }
    }
    return null;
  }
}

async function migrateAudio() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set in environment variables. Migration cannot proceed.");
    console.error("Please set it in your .env.local file or in your terminal environment.");
    return;
  }
  console.log(`Starting audio migration from local folder: ${LOCAL_SOURCE_BASE_DIR}`);
  console.log('Target Vercel Blob prefix:', AUDIO_PATH_PREFIX_IN_BLOB);
  
  const results = { success: 0, failed: 0, skipped_not_found: 0, totalProcessed: 0 };
  const totalFilesToProcess = VERSES_PER_SURAH.reduce((sum, count) => sum + count, 0);
  console.log(`Total audio files to process based on verse counts: ${totalFilesToProcess}`);

  for (let surah = 1; surah <= TOTAL_SURAHS; surah++) {
    const verseCount = VERSES_PER_SURAH[surah - 1];
    console.log(`\nProcessing Surah ${surah} (Verses: 1-${verseCount})`);
    for (let verse = 1; verse <= verseCount; verse++) {
      results.totalProcessed++;
      const result = await readAndUploadFile(surah, verse);
      if (result) {
        results.success++;
      } else {
        // Assuming readAndUploadFile returns null if local file not found or other upload error
        // We need to differentiate between file not found and upload error.
        // For now, let's assume null means it was skipped or failed.
        // The function `readAndUploadFile` logs specific errors.
        // If it returned null due to file not found, we can count it as skipped.
        // This requires `readAndUploadFile` to be more specific or check fs.access error.
        // Updated `readAndUploadFile` to log "Local file not found" and return null.
        // We can't easily distinguish here without more complex return from readAndUploadFile.
        // Let's assume any null return is a failure for simplicity in this counter.
        results.failed++; 
      }
      
      if (results.totalProcessed % 100 === 0 || results.totalProcessed === totalFilesToProcess) {
        console.log(`\n--- Progress Update ---`);
        console.log(`Files Processed: ${results.totalProcessed} / ${totalFilesToProcess}`);
        console.log(`Successfully Uploaded: ${results.success}`);
        console.log(`Failed/Skipped: ${results.failed}`); // Combined for now
        console.log(`-----------------------\n`);
      }
    }
  }
  
  console.log('\n--- Migration Complete! ---');
  console.log(`Total files attempted: ${results.totalProcessed}`);
  console.log(`Successfully uploaded: ${results.success}`);
  console.log(`Failed or skipped uploads: ${results.failed}`);
  console.log('---------------------------\n');

  if (results.failed > 0) {
    console.warn("Some files may have failed to upload or were not found locally. Please check the logs above for details.");
  } else {
    console.log("All found local audio files processed successfully!");
  }
}

migrateAudio().catch(err => {
  console.error("\nUnhandled error during migration process:", err);
});