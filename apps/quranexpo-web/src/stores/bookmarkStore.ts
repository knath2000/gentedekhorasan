import { $authStore } from '@clerk/astro/client';
import { persistentAtom } from '@nanostores/persistent';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
import { addBookmark as addBookmarkApi, deleteBookmark as deleteBookmarkApi, fetchBookmarks as fetchBookmarksApi, updateBookmark as updateBookmarkApi } from '../services/apiClient';
import type { Bookmark, Verse } from '../types/quran';

// Store for bookmarks, now with SSR-safe initialization
export const bookmarks = persistentAtom<Bookmark[]>('quranExpo.bookmarks', [], {
  encode: JSON.stringify,
  decode: JSON.parse
});

export const bookmarksLoading = atom(false);

export async function loadBookmarksFromApi(userId: string) {
  bookmarksLoading.set(true);
  const auth = $authStore.get();
  const token = await auth.session?.getToken();

  if (!token) {
    console.warn('No token, skipping API load.');
    bookmarksLoading.set(false);
    return;
  }

  try {
    const apiBookmarks = await fetchBookmarksApi(userId, token);
    const sortedBookmarks = apiBookmarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    bookmarks.set(sortedBookmarks);
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    bookmarks.set([]);
  } finally {
    bookmarksLoading.set(false);
  }
}

export async function addBookmark(userId: string, verse: Verse, surahName: string) {
  const bookmarkIdentifier = `${verse.surahId}-${verse.numberInSurah}`;
  const currentBookmarks = bookmarks.get();

  if (currentBookmarks.some(b => `${b.surahId}-${b.verseNumber}` === bookmarkIdentifier)) {
    return;
  }

  const auth = $authStore.get();
  const token = await auth.session?.getToken();

  if (!token) {
    return;
  }

  bookmarksLoading.set(true);
  try {
    const newBookmarkData = {
      surahId: verse.surahId,
      verseNumber: verse.numberInSurah,
      verseText: verse.verseText,
      surahName,
      translation: verse.translation || '',
      notes: '',
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    const addedBookmark = await addBookmarkApi(userId, newBookmarkData, token);
    bookmarks.set([addedBookmark, ...currentBookmarks]);
  } catch (error) {
    console.error('Error adding bookmark:', error);
  } finally {
    bookmarksLoading.set(false);
  }
}

export async function removeBookmark(userId: string, bookmarkId: string) {
  const currentBookmarks = bookmarks.get();
  const bookmarkToRemove = currentBookmarks.find(b => b.id === bookmarkId);

  if (!bookmarkToRemove) {
    return;
  }

  const auth = $authStore.get();
  const token = await auth.session?.getToken();

  if (!token) {
    return;
  }

  bookmarksLoading.set(true);
  try {
    await deleteBookmarkApi(userId, bookmarkId, token);
    bookmarks.set(currentBookmarks.filter(b => b.id !== bookmarkId));
  } catch (error) {
    console.error('Error removing bookmark:', error);
  } finally {
    bookmarksLoading.set(false);
  }
}

export async function updateBookmarkNote(userId: string, bookmarkId: string, notes: string) {
  const currentBookmarks = bookmarks.get();
  const bookmarkToUpdate = currentBookmarks.find(b => b.id === bookmarkId);

  if (!bookmarkToUpdate) {
    return;
  }

  const auth = $authStore.get();
  const token = await auth.session?.getToken();

  if (!token) {
    return;
  }

  bookmarksLoading.set(true);
  try {
    const updatedBookmark = await updateBookmarkApi(userId, bookmarkId, { notes }, token);
    const updatedBookmarksList = currentBookmarks.map(b =>
      b.id === bookmarkId ? { ...b, notes } : b
    );
    bookmarks.set(updatedBookmarksList);
  } catch (error) {
    console.error('Error updating bookmark note:', error);
  } finally {
    bookmarksLoading.set(false);
  }
}

export function isBookmarked(surahId: number, verseNumber: number): boolean {
  const currentBookmarks = bookmarks.get();
  return currentBookmarks.some(b => b.surahId === surahId && b.verseNumber === verseNumber);
}

export function getBookmarks(): Bookmark[] {
  return bookmarks.get();
}

export function useBookmarksStore() {
  const $bookmarks = useStore(bookmarks);
  const $bookmarksLoading = useStore(bookmarksLoading);
  return { bookmarks: $bookmarks, loading: $bookmarksLoading };
}