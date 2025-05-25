import { fetchMetadataFromAPI } from './apiClient';

// Define types based on the expected structure from Edge Config and API
// These should align with what the conversion script produces and the DB schema

interface SurahBasicInfo {
  number: number;
  name: string; // Arabic name
  tname: string; // Transliterated name
  ename: string; // English name
  ayas: number;
  type: string; // Revelation type
  order?: number; // Chronological order (optional in basic info)
  rukus?: number; // Ruku count (optional in basic info)
}

// Interface for the overall structure expected from Edge Config for "quranMetadata"
interface QuranEdgeConfigData {
  surahBasicInfo?: SurahBasicInfo[];
  navigationIndices?: NavigationIndices;
  // Add other top-level keys if your edge-config-data.json has more
}

interface SajdaVerse {
  sajda_id?: number; // Or whatever the primary key is
  surah_number: number;
  ayah_number: number;
  type?: string; // 'recommended' or 'obligatory'
}

interface NavigationIndexItem {
  surah: number;
  aya: number;
}

interface NavigationIndices {
  juzStarts?: Record<string, NavigationIndexItem>;
  pageStarts?: Record<string, NavigationIndexItem>;
  // Add other indices as needed
}

let localEdgeConfigData: QuranEdgeConfigData | undefined;
// No need for hasAttemptedProxyFetch or proxyFetchPromise as Edge Config is handled by API

// Function to fetch all metadata from the API (now directly from the centralized API)
// This function is now simplified as the API handles the Edge Config logic.
async function fetchAllMetadataFromAPI(): Promise<QuranEdgeConfigData | null> {
  try {
    console.log("[quranMetadataService] Attempting to fetch all metadata from centralized API.");
    // Assuming the centralized API has an endpoint to fetch all metadata at once
    // If not, this function might need to call fetchMetadataFromAPI multiple times
    // For simplicity, let's assume a 'all-metadata' type or similar
    const data = await fetchMetadataFromAPI<QuranEdgeConfigData>('all-metadata'); // Placeholder type
    if (data) {
      console.log("[quranMetadataService] Successfully fetched metadata from API. Data:", JSON.stringify(data, null, 2)?.substring(0, 500) + "...");
      localEdgeConfigData = data; // Cache locally
      return data;
    }
    throw new Error("fetchMetadataFromAPI returned null or failed");
  } catch (error) {
    console.error('[quranMetadataService] Error fetching all metadata from API:', error);
    return null;
  }
}


// Function to initialize local fallback data (no longer needed as Edge Config is handled by API)
async function initializeLocalFallback() {
  // This function is deprecated as the API now handles Edge Config fallback.
  // Keeping it as a placeholder for now, but its logic will be removed.
  console.warn("[quranMetadataService] initializeLocalFallback is deprecated and will be removed.");
}

export async function getBasicSurahList(): Promise<SurahBasicInfo[] | null> {
  // Directly fetch from API, as Edge Config logic is now in the centralized API
  try {
    const surahList = await fetchMetadataFromAPI<SurahBasicInfo[]>('surah-list');
    return surahList;
  } catch (apiError) {
    console.error("[quranMetadataService] API error fetching basic surah list:", apiError);
    return null;
  }
}

export async function getSajdaVerses(): Promise<SajdaVerse[] | null> {
  // Directly fetch from API
  try {
    const sajdaVerses = await fetchMetadataFromAPI<SajdaVerse[]>('sajdas');
    return sajdaVerses;
  } catch (apiError) {
    console.error("[quranMetadataService] API error fetching sajda verses:", apiError);
    return null;
  }
}

export async function getNavigationIndices(): Promise<NavigationIndices | null> {
  // Directly fetch from API
  try {
    const navIndices = await fetchMetadataFromAPI<NavigationIndices>('navigation-indices');
    return navIndices;
  } catch (apiError) {
    console.error("[quranMetadataService] API error fetching 'navigation-indices':", apiError);
    return null;
  }
}