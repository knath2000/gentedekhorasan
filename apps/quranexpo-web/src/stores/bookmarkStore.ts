import { $authStore } from '@clerk/astro/client'; // Import Clerk's auth store
import { persistentAtom } from '@nanostores/persistent';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
import { addBookmark as addBookmarkApi, deleteBookmark as deleteBookmarkApi, fetchBookmarks as fetchBookmarksApi, updateBookmark as updateBookmarkApi } from '../services/apiClient';
import type { Bookmark, Verse } from '../types/quran';

// Store para los marcadores
// Ahora almacenará los bookmarks de la API, no de localStorage directamente
export const bookmarks = persistentAtom<Bookmark[]>(
  'quranExpo.bookmarks',
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

// Store para el estado de carga de los bookmarks
export const bookmarksLoading = atom(false);

// Función para cargar los bookmarks desde la API
export async function loadBookmarksFromApi(userId: string) {
  bookmarksLoading.set(true);
  const auth = $authStore.get(); // Get current auth state
  const token = await auth.session?.getToken(); // Get session token
  console.log('Auth state:', auth);
  console.log('Session:', auth.session);
  console.log('Token obtained:', token ? 'Token present' : 'No token');

  if (!token) {
    console.warn('No authentication token available, cannot load bookmarks from API.');
    bookmarksLoading.set(false);
    return;
  }

  try {
    const apiBookmarks = await fetchBookmarksApi(userId, token);
    // Sort by createdAt descending
    const sortedBookmarks = apiBookmarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    bookmarks.set(sortedBookmarks);
    console.log(`Loaded ${sortedBookmarks.length} bookmarks from API for user ${userId}.`);
  } catch (error) {
    console.error(`Error loading bookmarks from API for user ${userId}:`, error);
    // Keep existing bookmarks in case of error, or clear if desired
    bookmarks.set([]); // Clear on error to avoid stale data
  } finally {
    bookmarksLoading.set(false);
  }
}

// Función para añadir un marcador
export async function addBookmark(userId: string, verse: Verse, surahName: string) {
  const bookmarkIdentifier = `${verse.surahId}-${verse.numberInSurah}`;
  const currentBookmarks = bookmarks.get();

  if (currentBookmarks.some(b => `${b.surahId}-${b.verseNumber}` === bookmarkIdentifier)) {
    console.log(`Bookmark already exists: ${bookmarkIdentifier}`);
    return;
  }

  const auth = $authStore.get();
  console.log('Auth state in addBookmark:', auth);
  console.log('Session available:', !!auth.session);
  console.log('User ID:', auth.userId);

  const token = await auth.session?.getToken();
  console.log('Token obtained:', token ? `${token.substring(0, 20)}...` : 'No token');

  if (!token) {
    console.warn('No authentication token available, cannot add bookmark.');
    return;
  }

  bookmarksLoading.set(true);
  try {
    const newBookmarkData: Omit<Bookmark, 'id' | 'userId'> = {
      surahId: verse.surahId,
      verseNumber: verse.numberInSurah,
      verseText: verse.verseText,
      surahName: surahName,
      translation: verse.translation || '',
      notes: '', // Inicialmente vacío
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    const addedBookmark = await addBookmarkApi(userId, newBookmarkData, token);
    bookmarks.set([addedBookmark, ...currentBookmarks]); // Add to the beginning for recency
    console.log(`Bookmark added via API: ${addedBookmark.id}`);
  } catch (error) {
    console.error(`Error adding bookmark ${bookmarkIdentifier} via API:`, error);
  } finally {
    bookmarksLoading.set(false);
  }
}

// Función para eliminar un marcador
export async function removeBookmark(userId: string, bookmarkId: string) {
  const currentBookmarks = bookmarks.get();
  const bookmarkToRemove = currentBookmarks.find(b => b.id === bookmarkId);

  if (!bookmarkToRemove) {
    console.log(`Bookmark not found locally: ${bookmarkId}`);
    return;
  }

  const auth = $authStore.get();
  const token = await auth.session?.getToken();

  if (!token) {
    console.warn('No authentication token available, cannot remove bookmark.');
    return;
  }

  bookmarksLoading.set(true);
  try {
    await deleteBookmarkApi(userId, bookmarkId, token);
    bookmarks.set(currentBookmarks.filter(b => b.id !== bookmarkId));
    console.log(`Bookmark removed via API: ${bookmarkId}`);
  } catch (error) {
    console.error(`Error removing bookmark ${bookmarkId} via API:`, error);
  } finally {
    bookmarksLoading.set(false);
  }
}

// Función para actualizar la nota de un marcador
export async function updateBookmarkNote(userId: string, bookmarkId: string, notes: string) {
  const currentBookmarks = bookmarks.get();
  const bookmarkToUpdate = currentBookmarks.find(b => b.id === bookmarkId);

  if (!bookmarkToUpdate) {
    console.log(`Bookmark not found locally for note update: ${bookmarkId}`);
    return;
  }

  const auth = $authStore.get();
  const token = await auth.session?.getToken();

  if (!token) {
    console.warn('No authentication token available, cannot update bookmark note.');
    return;
  }

  bookmarksLoading.set(true);
  try {
    const updatedBookmark = await updateBookmarkApi(userId, bookmarkId, { notes }, token);
    const updatedBookmarksList = currentBookmarks.map(b =>
      b.id === bookmarkId ? { ...b, notes: updatedBookmark.notes } : b
    );
    bookmarks.set(updatedBookmarksList);
    console.log(`Bookmark note updated via API for: ${bookmarkId}`);
  } catch (error) {
    console.error(`Error updating bookmark note for ${bookmarkId} via API:`, error);
  } finally {
    bookmarksLoading.set(false);
  }
}

// Función para verificar si un verso está marcado
export function isBookmarked(surahId: number, verseNumber: number): boolean {
  const currentBookmarks = bookmarks.get();
  return currentBookmarks.some(b => b.surahId === surahId && b.verseNumber === verseNumber);
}

// Función para obtener todos los marcadores (ordenados por createdAt descendente)
export function getBookmarks(): Bookmark[] {
  return bookmarks.get(); // Already sorted on load/add
}

// Hook para usar los bookmarks en componentes de React/Preact
export function useBookmarksStore() {
  const $bookmarks = useStore(bookmarks);
  const $bookmarksLoading = useStore(bookmarksLoading);
  return { bookmarks: $bookmarks, loading: $bookmarksLoading };
}