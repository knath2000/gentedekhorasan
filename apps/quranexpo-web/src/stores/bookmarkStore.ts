import { persistentAtom } from '@nanostores/persistent';
import { atom } from 'nanostores';
import type { Verse } from '../types/quran';

// Interfaz para un marcador
export interface Bookmark {
  id: string; // surahId-verseNumber
  surahId: number;
  verseNumber: number;
  verseText: string;
  surahName: string;
  translation: string;
  notes?: string;
  createdAt: string; // ISO string
}

// Store para los marcadores
export const bookmarks = persistentAtom<Bookmark[]>(
  'quranExpo.bookmarks', 
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);

// Función para añadir un marcador
export function addBookmark(verse: Verse, surahName: string) {
  const bookmarkId = `${verse.surahId}-${verse.numberInSurah}`;
  const currentBookmarks = bookmarks.get();

  if (!currentBookmarks.some(b => b.id === bookmarkId)) {
    const newBookmark: Bookmark = {
      id: bookmarkId,
      surahId: verse.surahId,
      verseNumber: verse.numberInSurah,
      verseText: verse.text,
      surahName: surahName,
      translation: verse.translation || '',
      createdAt: new Date().toISOString(),
      notes: '', // Inicialmente vacío
    };
    bookmarks.set([...currentBookmarks, newBookmark]);
    console.log(`Bookmark added: ${bookmarkId}`);
  } else {
    console.log(`Bookmark already exists: ${bookmarkId}`);
  }
}

// Función para eliminar un marcador
export function removeBookmark(bookmarkId: string) {
  const currentBookmarks = bookmarks.get();
  bookmarks.set(currentBookmarks.filter(b => b.id !== bookmarkId));
  console.log(`Bookmark removed: ${bookmarkId}`);
}

// Función para actualizar la nota de un marcador
export function updateBookmarkNote(bookmarkId: string, notes: string) {
  const currentBookmarks = bookmarks.get();
  const updatedBookmarks = currentBookmarks.map(b => 
    b.id === bookmarkId ? { ...b, notes } : b
  );
  bookmarks.set(updatedBookmarks);
  console.log(`Bookmark note updated for: ${bookmarkId}`);
}

// Función para verificar si un verso está marcado
export function isBookmarked(surahId: number, verseNumber: number): boolean {
  const bookmarkId = `${surahId}-${verseNumber}`;
  return bookmarks.get().some(b => b.id === bookmarkId);
}

// Función para obtener todos los marcadores (opcionalmente ordenados)
export function getBookmarks(): Bookmark[] {
  // Podríamos añadir lógica de ordenación aquí si fuera necesario
  return bookmarks.get().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}