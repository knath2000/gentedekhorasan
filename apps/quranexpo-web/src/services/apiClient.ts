import type { Bookmark, Surah, Verse } from '../types/quran';

// The API base URL is hardcoded to match the quranexpo2 native app
const API_BASE_URL = 'https://gentedekhorasan.vercel.app/api/v1'; // Updated to external API
console.log('API_BASE_URL en apiClient.ts:', API_BASE_URL);

/**
 * Fetches the list of all Surahs from the API
 * @returns A Promise resolving to an array of Surah objects
 * @throws Error If the API request fails
 */
export async function fetchSurahList(): Promise<Surah[]> {
  try {
    // Use the metadata API endpoint from quranexpo2 native app
    const response = await fetch(`${API_BASE_URL}/get-metadata?type=surah-list`);
    
    // Handle non-OK responses
    if (!response.ok) {
      throw new Error(`API error: Failed to fetch Surah list. Status: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // If the API returns data in a different format than expected, handle it here
    if (!Array.isArray(data)) {
      throw new Error('API returned invalid data structure for Surah list');
    }
    
    // Map API response to our Surah interface
    return data.map(item => ({
      number: item.number,
      name: item.name, // Arabic name
      englishName: item.ename,
      englishNameTranslation: `Chapter ${item.ename}`,
      numberOfAyahs: item.ayas,
      revelationType: item.type === 'Meccan' || item.type === 'Medinan' ? item.type : 'Meccan',
      revelationOrder: item.order, // Asumiendo que 'order' de la API es el orden de revelación
      id: String(item.number),
      arabicName: item.name,
      transliterationName: item.tname || item.ename, // Usar tname si está disponible, de lo contrario, usar ename como fallback
    }));
  } catch (error) {
    // Log the error for debugging
    console.error('Error in fetchSurahList:', error);
    
    // Re-throw the error to be handled by the caller
    throw error;
  }
}
 
/**
 * Fetches a specific Surah by its ID
 * @param surahId The ID of the Surah to fetch
 * @returns A Promise resolving to the Surah object or null if not found
 * @throws Error If the API request fails
 */
export async function fetchSurahById(surahId: number): Promise<Surah | null> {
  try {
    // Get the full Surah list
    const surahList = await fetchSurahList();
    
    // Find the specific Surah by ID
    const surah = surahList.find(s => s.number === surahId);
    
    // Return the Surah or null if not found
    return surah || null;
  } catch (error) {
    console.error(`Error in fetchSurahById for surahId ${surahId}:`, error);
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
  translator: string = "en.yusufali"
): Promise<Verse[]> {
  try {
    // Fetch Surah details to get the surahName
    const surahData = await fetchSurahById(surahId);
    if (!surahData) {
      throw new Error(`Surah with ID ${surahId} not found.`);
    }
    const surahName = surahData.englishName;

    // Fetch Arabic verses
    const arabicVersesResponse = await fetch(`${API_BASE_URL}/get-verses?surah=${surahId}`);
    
    if (!arabicVersesResponse.ok) {
      throw new Error(`API error: Failed to fetch Arabic verses for Surah ${surahId}. Status: ${arabicVersesResponse.status}`);
    }
    
    const arabicVerses = await arabicVersesResponse.json();
    
    if (!Array.isArray(arabicVerses)) {
      throw new Error(`API returned invalid data structure for Arabic verses of Surah ${surahId}`);
    }

    // NOTE: This is an N+1 query problem. For each Arabic verse, we make a separate API call
    // to get its translation. This is inefficient.
    // A more efficient solution would require a backend endpoint that returns all translations for a Surah
    // or includes translations directly in the /get-verses endpoint.
    const translatedVersesPromises = arabicVerses.map(async (verse) => {
      const translatedVerse = await fetchSingleTranslatedVerse(
        verse.surahId,
        verse.numberInSurah,
        translator
      );
      return {
        id: verse.id, // Ensure ID is passed
        surahId: verse.surahId,
        numberInSurah: verse.numberInSurah,
        verseText: verse.text, // Use 'text' from API as 'verseText'
        translation: translatedVerse?.translation || '',
        surahName: surahName, // Add surahName to each verse object
      };
    });

    const versesWithTranslations = await Promise.all(translatedVersesPromises);
    
    return versesWithTranslations;
  } catch (error) {
    console.error(`Error in fetchVersesForSurah for surahId ${surahId}:`, error);
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
  translator: string = "en.yusufali"
): Promise<Verse | null> {
  try {
    // Use the same API endpoint as quranexpo2 native app
    const response = await fetch(
      `${API_BASE_URL}/get-translated-verse?surah=${surahId}&ayah=${ayahId}&translator=${translator}`
    );
    
    // Handle non-OK responses
    if (!response.ok) {
      // Specific error for 404 (not found)
      if (response.status === 404) {
        throw new Error(`Verse ${surahId}:${ayahId} not found.`);
      }
      
      // General error for other status codes
      throw new Error(`API error: Failed to fetch verse ${surahId}:${ayahId}. Status: ${response.status}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // If the API returns data in a different format than expected, handle it here
    if (!data || !data.text) {
      throw new Error(`API returned invalid data structure for verse ${surahId}:${ayahId}`);
    }
    
    // Convert API format to our Verse format
    return {
      id: data.id || parseInt(`${surahId}${ayahId}`), // Use API's ID or generate one
      surahId: surahId,
      numberInSurah: ayahId,
      verseText: data.text || '', // Renamed 'text' to 'verseText'
      translation: data.translation || ''
    };
  } catch (error) {
    // Log the error for debugging
    console.error(`Error in fetchSingleTranslatedVerse for ${surahId}:${ayahId}:`, error);
    
    // Re-throw the error to be handled by the caller (no silent failures)
    throw error;
  }
}

/**
 * Fetches the description for a specific Surah from the API
 * @param surahId The ID of the Surah to fetch the description for
 * @returns A Promise resolving to the Surah description string or null if not found
 * @throws Error If the API request fails
 */
export async function fetchSurahDescription(surahId: number): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/get-surah-description?surahId=${surahId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Description not found
      }
      throw new Error(`API error: Failed to fetch Surah description for ${surahId}. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.description || null;
  } catch (error) {
    console.error(`Error in fetchSurahDescription for surahId ${surahId}:`, error);
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
    console.error(`Error in fetchBookmarks for user ${userId}:`, error);
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
    console.log('=== FRONTEND API CALL DEBUG ===');
    console.log('Token received:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('API URL:', `${API_BASE_URL}/user-bookmarks`);
    console.log('Headers to send:', {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'NO AUTH HEADER'
    });
    console.log('Body to send:', { ...bookmarkData, userId, timestamp: new Date().toISOString() });
    
    const response = await fetch(`${API_BASE_URL}/user-bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...bookmarkData, userId, timestamp: new Date().toISOString() }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`API error: Failed to add bookmark for user ${userId}. Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Bookmark;
  } catch (error) {
    console.error(`Error in addBookmark for user ${userId}:`, error);
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
      body: JSON.stringify(updatedBookmark),
    });
    if (!response.ok) {
      throw new Error(`API error: Failed to update bookmark ${bookmarkId} for user ${userId}. Status: ${response.status}`);
    }
    const data = await response.json();
    return data as Bookmark;
  } catch (error) {
    console.error(`Error in updateBookmark ${bookmarkId} for user ${userId}:`, error);
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
    console.error(`Error in deleteBookmark ${bookmarkId} for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Fetches AI-generated translation for a specific verse.
 * @param surahId The ID of the Surah.
 * @param verseNumber The number of the verse within the Surah.
 * @param verseText The Arabic text of the verse to translate.
 * @returns A Promise resolving to the AI-generated translation string.
 * @throws Error If the API request fails.
 */
export async function getAITranslation(surahId: number, verseNumber: number, verseText: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ surahId, verseNumber, verseText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AI Translation API error:', errorData);
      throw new Error(`API error: Failed to fetch AI translation. Status: ${response.status}, Details: ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    if (!data || typeof data.translation !== 'string') {
      throw new Error('API returned invalid data structure for AI translation');
    }

    return data.translation;
  } catch (error) {
    console.error(`Error in getAITranslation for ${surahId}:${verseNumber}:`, error);
    throw error;
  }
}