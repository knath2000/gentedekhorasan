// src/lib/blobClient.ts
// This file should only contain client-safe utilities if imported by client-side code.
// Server-side functions like put, list, del, head from '@vercel/blob' should be
// imported directly in server-side scripts or API routes, not here.

// Type-safe URL pattern for audio files
export const AUDIO_PATH_PREFIX = 'quran-audio/alafasy128/';

// Get the full pathname for a specific audio file in the blob store
export const getAudioPathname = (surahNumber: number, verseNumber: number): string => {
  const surahStr = surahNumber.toString().padStart(3, '0');
  const verseStr = verseNumber.toString().padStart(3, '0');
  return `${AUDIO_PATH_PREFIX}${surahStr}${verseStr}.mp3`;
};

// Type definition for blob audio metadata (can be expanded if needed for client-side display)
// This is a general structure, actual metadata might come from an API if needed client-side.
export interface BlobAudioFileMetadata {
  url: string; // The publicly accessible URL
  pathname: string; // The path within the blob store
  surahNumber: number;
  verseNumber: number;
  size?: number;
  uploadedAt?: Date;
  contentType?: string;
}

// Note: The PutBlobResult type and server-side functions (put, list, del, head)
// from '@vercel/blob' are not imported or exported here as this file is now
// focused on client-safe utilities. If you need these in server-side scripts,
// import them directly from '@vercel/blob'.