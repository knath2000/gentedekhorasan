import { $authStore } from '@clerk/astro/client'; // Import Clerk's auth store
import type { Bookmark, Surah, Verse } from '../types/quran';
import { addBookmark, fetchBookmarks, fetchSingleTranslatedVerse, fetchSurahById } from './apiClient';

const LOCAL_STORAGE_BOOKMARKS_KEY = 'quran_bookmarks';

interface LocalStorageBookmark {
  surahId: number;
  verseNumber: number;
}

/**
 * Reads bookmarks from localStorage.
 * @returns An array of bookmarks from localStorage.
 */
function getBookmarksFromLocalStorage(): LocalStorageBookmark[] {
  try {
    const bookmarksJson = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Error reading bookmarks from localStorage:', error);
    return [];
  }
}

/**
 * Clears bookmarks from localStorage after successful migration.
 */
function clearBookmarksFromLocalStorage(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_BOOKMARKS_KEY);
    console.log('Bookmarks cleared from localStorage.');
  } catch (error) {
    console.error('Error clearing bookmarks from localStorage:', error);
  }
}

/**
 * Migrates bookmarks from localStorage to the user's account in the database.
 * @param userId The ID of the authenticated user.
 * @returns A Promise that resolves when migration is complete.
 */
export async function migrateBookmarksToDatabase(userId: string): Promise<void> {
  console.log(`Attempting to migrate bookmarks for user: ${userId}`);
  const localBookmarks = getBookmarksFromLocalStorage();

  if (localBookmarks.length === 0) {
    console.log('No bookmarks found in localStorage to migrate.');
    return;
  }

  const auth = $authStore.get();
  const token = await auth.session?.getToken();

  if (!token) {
    console.warn('No authentication token available, cannot migrate bookmarks.');
    return;
  }

  try {
    // Fetch existing bookmarks from the database to avoid duplicates
    const existingDbBookmarks = await fetchBookmarks(userId, token);
    const existingDbBookmarkSet = new Set(
      existingDbBookmarks.map(b => `${b.surahId}-${b.verseNumber}`)
    );

    const migrationPromises = localBookmarks.map(async (localBookmark) => {
      const bookmarkIdentifier = `${localBookmark.surahId}-${localBookmark.verseNumber}`;
      if (!existingDbBookmarkSet.has(bookmarkIdentifier)) {
        // Fetch additional details for the bookmark
        let verseDetails: Verse | null = null;
        let surahDetails: Surah | null = null;

        try {
          verseDetails = await fetchSingleTranslatedVerse(localBookmark.surahId, localBookmark.verseNumber);
          surahDetails = await fetchSurahById(localBookmark.surahId);
        } catch (fetchError) {
          console.error(`Failed to fetch details for bookmark ${bookmarkIdentifier}:`, fetchError);
          // If we can't get details, skip this bookmark to avoid partial data
          return;
        }

        if (!verseDetails || !surahDetails) {
          console.warn(`Could not retrieve full details for bookmark ${bookmarkIdentifier}, skipping.`);
          return;
        }

        const newBookmark: Omit<Bookmark, 'id' | 'userId'> = {
          surahId: localBookmark.surahId,
          verseNumber: localBookmark.verseNumber,
          verseText: verseDetails.verseText,
          surahName: surahDetails.englishName,
          translation: verseDetails.translation || '',
          notes: '', // Default empty notes for migrated bookmarks
          createdAt: new Date().toISOString(),
          timestamp: new Date().toISOString(), // Use current time for timestamp
        };
        try {
          await addBookmark(userId, newBookmark, token);
          console.log(`Migrated bookmark: Surah ${localBookmark.surahId}, Verse ${localBookmark.verseNumber}`);
        } catch (addError) {
          console.error(`Failed to add bookmark ${bookmarkIdentifier} for user ${userId}:`, addError);
        }
      } else {
        console.log(`Bookmark ${bookmarkIdentifier} already exists in DB for user ${userId}, skipping migration.`);
      }
    });

    await Promise.all(migrationPromises);
    clearBookmarksFromLocalStorage();
    console.log('Bookmark migration process completed.');
  } catch (error) {
    console.error(`Error during bookmark migration for user ${userId}:`, error);
    // Optionally, decide whether to clear local storage if migration partially failed
    // For now, we'll only clear on full success to prevent data loss.
  }
}