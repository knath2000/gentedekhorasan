import type { Bookmark, Surah, Verse } from '../types/quran';

import { logger } from '../utils/logger';

const verseTranslationCache = new Map<string, Verse>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

function getCacheKey(surahId: number, ayahId: number, translator: string): string {
  return `${surahId}-${ayahId}-${translator}`;
}

const API_BASE_URL = 'https://gentedekhorasan.vercel.app/api/v1'; // Updated to external API
logger.info('API_BASE_URL en apiClient.ts:', API_BASE_URL);

/**
 * Fetches the list of all Surahs from the API
 * @returns A Promise resolving to an array of Surah objects
 * @throws Error If the API request fails
 */
export async function fetchSurahList(token?: string): Promise<Surah[]> {  // Add token if needed for authenticated calls
  try {
    const response = await fetch(`${API_BASE_URL}/get-metadata?type=surah-list`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      throw new Error(`API error: Failed to fetch Surah list. Status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('API returned invalid data structure for Surah list');
    }
    return data.map(item => ({
      number: item.number,
      name: item.name,
      englishName: item.ename,
      englishNameTranslation: `Chapter ${item.ename}`,
      numberOfAyahs: item.ayas,
      revelationType: item.type === 'Meccan' || item.type === 'Medinan' ? item.type : 'Meccan',
      revelationOrder: item.order,
      id: String(item.number),
      arabicName: item.name,
      transliterationName: item.tname || item.ename,
    }));
  } catch (error) {
    logger.error('Error in fetchSurahList:', error);
    throw error;
  }
}

/**
 * Fetches a specific Surah by its ID
 * @param surahId The ID of the Surah to fetch
 * @returns A Promise resolving to the Surah object or null if not found
 * @throws Error If the API request fails
 */
export async function fetchSurahById(surahId: number, token?: string): Promise<Surah | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/get-metadata?type=surah-list`);
    if (!response.ok) {
      throw new Error(`API error: Failed to fetch Surah list. Status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('API returned invalid data structure for Surah list');
    }
    const surah = data.find(item => item.number === surahId);
    if (surah) {
      return {
        number: surah.number,
        name: surah.name,
        englishName: surah.ename,
        englishNameTranslation: `Chapter ${surah.ename}`,
        numberOfAyahs: surah.ayas,
        revelationType: surah.type === 'Meccan' || surah.type === 'Medinan' ? surah.type : 'Meccan',
        revelationOrder: surah.order,
        id: String(surah.number),
        arabicName: surah.name,
        transliterationName: surah.tname || surah.ename,
      };
    }
    return null;
  } catch (error) {
    logger.error(`Error in fetchSurahById for surahId ${surahId}:`, error);
    throw error;
  }
}

/**
 * Fetches all verses for a specific Surah with translations
 * @param surahId The ID of the Surah
 * @param translator The translator code (default to English Yusuf Ali)
 * @returns A Promise resolving to an array of Verse objects with Arabic text and translations
 * @throws Error If the API request fails
 */
export async function fetchVersesForSurah(
  surahId: number,
  translator: string = "en.yusufali",
  token?: string
): Promise<Verse[]> {
  try {
    const surahData = await fetchSurahById(surahId, token);  // Pass token if available
    if (!surahData) {
      throw new Error(`Surah with ID ${surahId} not found.`);
    }
    const surahName = surahData.englishName;
    const arabicVersesResponse = await fetch(`${API_BASE_URL}/get-verses?surah=${surahId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
    if (!arabicVersesResponse.ok) {
      throw new Error(`API error: Failed to fetch Arabic verses for Surah ${surahId}. Status: ${arabicVersesResponse.status}`);
    }
    const arabicVerses = await arabicVersesResponse.json();
    if (!Array.isArray(arabicVerses)) {
      throw new Error(`API returned invalid data structure for Arabic verses of Surah ${surahId}`);
    }
    const translatedVersesPromises = arabicVerses.map(async (verse) => {
      const translatedVerse = await fetchSingleTranslatedVerse(verse.surahId, verse.numberInSurah, translator, token);
      return {
        id: verse.id,
        surahId: verse.surahId,
        numberInSurah: verse.numberInSurah,
        verseText: verse.text,
        translation: translatedVerse?.translation || '',
        surahName: surahName,
      };
    });
    const versesWithTranslations = await Promise.all(translatedVersesPromises);
    return versesWithTranslations;
  } catch (error) {
    logger.error(`Error in fetchVersesForSurah for surahId ${surahId}:`, error);
    throw error;
  }
}

/**
 * Fetches a single verse with its translation from the API
 * @param surahId The number of the Surah (1-based)
 * @param ayahId The number of the Ayah within the Surah
 * @param translator The translator code (default to English Yusuf Ali)
 * @returns A Promise resolving to a Verse object or null if an error occurs
 * @throws Error If the API request fails (network issue, non-200 status, etc.)
 */
export async function fetchSingleTranslatedVerse(
  surahId: number,
  ayahId: number,
  translator: string = "en.yusufali",
  token?: string
): Promise<Verse | null> {
  const cacheKey = getCacheKey(surahId, ayahId, translator);
  const cachedVerse = verseTranslationCache.get(cacheKey);
  if (cachedVerse) {
    return cachedVerse;
  }
  try {
    const response = await fetch(
      `${API_BASE_URL}/get-translated-verse?surah=${surahId}&ayah=${ayahId}&translator=${translator}`,
      {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      }
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: Failed to fetch verse ${surahId}:${ayahId}. Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data || !data.text) {
      throw new Error(`API returned invalid data structure for verse ${surahId}:${ayahId}`);
    }
    const verse: Verse = {
      id: data.id || `${surahId}${ayahId}`,
      surahId,
      numberInSurah: ayahId,
      verseText: data.text,
      translation: data.translation || ''
    };
    verseTranslationCache.set(cacheKey, verse);
    setTimeout(() => verseTranslationCache.delete(cacheKey), CACHE_TTL);
    return verse;
  } catch (error) {
    logger.error(`Error in fetchSingleTranslatedVerse for ${surahId}:${ayahId}:`, error);
    throw error;
  }
}

/**
 * Caché para descripciones de Surah
 */
const surahDescriptionCache = new Map<number, { description: string, timestamp: number }>();
const SURAH_DESCRIPTION_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

/**
 * Fetches the description for a specific Surah from the API
 * @param surahId The ID of the Surah to fetch the description for
 * @returns A Promise resolving to the Surah description string or null if not found
 * @throws Error If the API request fails
 */
export async function fetchSurahDescription(surahId: number): Promise<string | null> {
  const cachedData = surahDescriptionCache.get(surahId);
  if (cachedData && (Date.now() - cachedData.timestamp < SURAH_DESCRIPTION_CACHE_TTL)) {
    logger.debug(`Serving Surah description for ${surahId} from cache.`);
    return cachedData.description;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/get-surah-description?surahId=${surahId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Description not found
      }
      throw new Error(`API error: Failed to fetch Surah description for ${surahId}. Status: ${response.status}`);
    }

    const data = await response.json();
    const description = data.description || null;

    if (description) {
      surahDescriptionCache.set(surahId, { description, timestamp: Date.now() });
      logger.debug(`Surah description for ${surahId} cached.`);
    }
    
    return description;
  } catch (error) {
    logger.error(`Error in fetchSurahDescription for surahId ${surahId}:`, error);
    throw error;
  }
}

/**
 * Fetches bookmarks for a specific user.
 * @param userId The ID of the user.
 * @returns A Promise resolving to an array of Bookmark objects.
 * @throws Error If the API request fails.
 */
export async function fetchBookmarks(userId: string, token: string): Promise<Bookmark[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/user-bookmarks?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`API error: Failed to fetch bookmarks for user ${userId}. Status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('API returned invalid data structure for bookmarks');
    }
    return data as Bookmark[];
  } catch (error) {
    logger.error(`Error in fetchBookmarks for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Adds a new bookmark for a user.
 * @param userId The ID of the user.
 * @param bookmark The bookmark object to add.
 * @param token The authentication token.
 * @returns A Promise resolving to the added Bookmark object.
 * @throws Error If the API request fails.
 */
export async function addBookmark(userId: string, bookmark: Omit<Bookmark, 'id' | 'userId' | 'timestamp'>, token: string): Promise<Bookmark> {
  try {
    const bookmarkData = {
      surahId: bookmark.surahId,
      verseNumber: bookmark.verseNumber,
      verseText: bookmark.verseText,
      surahName: bookmark.surahName,
      translation: bookmark.translation,
      notes: bookmark.notes || ''
    };
    
    // ✅ DEBUGGING - Verificar token y headers
    logger.debug('=== FRONTEND API CALL DEBUG ===');
    logger.debug('Token received:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    logger.debug('API URL:', `${API_BASE_URL}/user-bookmarks`);
    logger.debug('Headers to send:', {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'NO AUTH HEADER'
    });
    logger.debug('Body to send:', { ...bookmarkData, userId, timestamp: new Date().toISOString() });
    
    const response = await fetch(`${API_BASE_URL}/user-bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...bookmarkData, userId, timestamp: new Date().toISOString() }),
    });
    
    logger.debug('Response status:', response.status);
    logger.debug('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Error response body:', errorText);
      throw new Error(`API error: Failed to add bookmark for user ${userId}. Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Bookmark;
  } catch (error) {
    logger.error(`Error in addBookmark for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Updates an existing bookmark for a user.
 * @param userId The ID of the user.
 * @param bookmarkId The ID of the bookmark to update.
 * @param updatedBookmark The updated bookmark object.
 * @param token The authentication token.
 * @returns A Promise resolving to the updated Bookmark object.
 * @throws Error If the API request fails.
 */
export async function updateBookmark(userId: string, bookmarkId: string, updatedBookmark: Partial<Bookmark>, token: string): Promise<Bookmark> {
  try {
    const response = await fetch(`${API_BASE_URL}/user-bookmarks?id=${bookmarkId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ notes: updatedBookmark.notes }), // Asegurar que solo se envíe 'notes'
    });
    if (!response.ok) {
      throw new Error(`API error: Failed to update bookmark ${bookmarkId} for user ${userId}. Status: ${response.status}`);
    }
    const data = await response.json();
    return data as Bookmark;
  } catch (error) {
    logger.error(`Error in updateBookmark ${bookmarkId} for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Deletes a bookmark for a user.
 * @param userId The ID of the user.
 * @param bookmarkId The ID of the bookmark to delete.
 * @param token The authentication token.
 * @returns A Promise resolving to true if successful, false otherwise.
 * @throws Error If the API request fails.
 */
export async function deleteBookmark(userId: string, bookmarkId: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/user-bookmarks?id=${bookmarkId}`, { // Corregido el parámetro de consulta a 'id'
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`API error: Failed to delete bookmark ${bookmarkId} for user ${userId}. Status: ${response.status}`);
    }
    return true;
  } catch (error) {
    logger.error(`Error in deleteBookmark ${bookmarkId} for user ${userId}:`, error);
    throw error;
  }
}