/* eslint-env node */
// scripts/deleteVercelBlobAudio.js
// This script deletes all blobs under the specified prefix.
// Ensure BLOB_READ_WRITE_TOKEN is in your environment variables.
// To run: node scripts/deleteVercelBlobAudio.js

const { list, del } = require('@vercel/blob');
const { Buffer } = require('buffer'); // Not strictly needed for list/del, but good to keep consistent if other ops were added

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// This should match the prefix used for uploads
const AUDIO_PATH_PREFIX_IN_BLOB = 'quran-audio/alafasy128/';

async function deleteAllAudioBlobs() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set. Deletion cannot proceed.");
    return;
  }

  console.log(`Listing blobs with prefix: ${AUDIO_PATH_PREFIX_IN_BLOB}...`);

  try {
    let hasMore = true;
    let cursor = undefined;
    const urlsToDelete = [];

    while (hasMore) {
      const listResult = await list({
        prefix: AUDIO_PATH_PREFIX_IN_BLOB,
        cursor: cursor,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      if (listResult.blobs.length === 0 && !listResult.cursor) {
        console.log("No blobs found with the specified prefix.");
        hasMore = false;
        break;
      }
      
      listResult.blobs.forEach(blob => {
        console.log(`  Found blob: ${blob.pathname} (URL: ${blob.url})`);
        urlsToDelete.push(blob.url);
      });

      if (listResult.hasMore && listResult.cursor) {
        cursor = listResult.cursor;
        console.log(`  Fetching next page of results (cursor: ${cursor})...`);
      } else {
        hasMore = false;
      }
    }

    if (urlsToDelete.length > 0) {
      console.log(`\nAttempting to delete ${urlsToDelete.length} blob(s)...`);
      // The `del` function can take an array of URLs
      await del(urlsToDelete, { token: process.env.BLOB_READ_WRITE_TOKEN });
      console.log(`Successfully submitted deletion request for ${urlsToDelete.length} blob(s).`);
      console.log("Note: Deletion might take a short while to reflect in the Vercel dashboard.");
    } else {
      console.log("No blobs to delete.");
    }

  } catch (error) {
    console.error("Error during blob deletion process:", error);
    if (error.response) {
        try {
            const errorBody = await error.response.text();
            console.error('Error response body:', errorBody);
        } catch (e) { /* ignore */ }
    }
  }
}

deleteAllAudioBlobs().catch(err => {
  console.error("\nUnhandled error during deletion script execution:", err);
});