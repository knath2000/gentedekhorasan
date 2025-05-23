import { fetchEdgeConfigProxyData, fetchMetadataFromAPI } from './apiClient';

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
let hasAttemptedProxyFetch = false;
let proxyFetchPromise: Promise<QuranEdgeConfigData | null> | null = null;

// Function to fetch all metadata from the Edge Config proxy
async function fetchAllMetadataFromProxy(): Promise<QuranEdgeConfigData | null> {
  if (!proxyFetchPromise) {
    proxyFetchPromise = (async () => {
      try {
        console.log("[quranMetadataService] Attempting to fetch all metadata from Edge Config proxy via apiClient.");
        const data = await fetchEdgeConfigProxyData<QuranEdgeConfigData>();
        if (data) {
          console.log("[quranMetadataService] Successfully fetched metadata from proxy. Data:", JSON.stringify(data, null, 2)?.substring(0, 500) + "...");
          hasAttemptedProxyFetch = true;
          localEdgeConfigData = data; // Cache locally
          return data;
        }
        // If data is null (error handled in fetchEdgeConfigProxyData and rethrown, caught below)
        throw new Error("fetchEdgeConfigProxyData returned null or failed");
      } catch (error) {
        console.error('[quranMetadataService] Error fetching from Edge Config proxy via apiClient:', error);
        hasAttemptedProxyFetch = true;
        // Attempt to initialize local fallback if proxy fails, especially in dev
        await initializeLocalFallback();
        return null;
      } finally {
        proxyFetchPromise = null; // Reset promise so it can be called again if needed
      }
    })();
  }
  return proxyFetchPromise;
}


// Function to initialize local fallback data (e.g., from specific API endpoints if proxy fails)
async function initializeLocalFallback() {
  if (__DEV__) { // Only run this complex fallback logic in development
    console.warn("[quranMetadataService] Edge Config proxy failed or not available. Initializing local fallback for DEV.");
    try {
      if (!localEdgeConfigData?.surahBasicInfo) {
        const surahList = await fetchMetadataFromAPI<SurahBasicInfo[]>('surah-list');
        if (surahList) {
          localEdgeConfigData = { ...localEdgeConfigData, surahBasicInfo: surahList };
          console.info("[quranMetadataService] DEV: Populated localEdgeConfigData.surahBasicInfo from API.");
        }
      }
      if (!localEdgeConfigData?.navigationIndices) {
        const navIndices = await fetchMetadataFromAPI<NavigationIndices>('navigation-indices');
        if (navIndices) {
          localEdgeConfigData = { ...localEdgeConfigData, navigationIndices: navIndices };
          console.info("[quranMetadataService] DEV: Populated localEdgeConfigData.navigationIndices from API.");
        }
      }
    } catch (error) {
      console.error("[quranMetadataService] DEV: Failed to initialize local fallback data from APIs:", error);
    }
  } else {
    console.warn("[quranMetadataService] Edge Config proxy failed. Fallbacks to specific APIs will occur per function call in PROD.");
  }
}

export async function getBasicSurahList(): Promise<SurahBasicInfo[] | null> {
  const metadata = await fetchAllMetadataFromProxy();

  if (metadata?.surahBasicInfo) {
    console.log("[quranMetadataService] Using surahBasicInfo from (proxy/cached) metadata. Count:", metadata.surahBasicInfo.length);
    return metadata.surahBasicInfo;
  }
  
  // If proxy provided metadata but not surahBasicInfo, or if proxy failed and local cache has it (from dev fallback)
  if (localEdgeConfigData?.surahBasicInfo) {
     console.log("[quranMetadataService] Using surahBasicInfo from localEdgeConfigData. Count:", localEdgeConfigData.surahBasicInfo.length);
     return localEdgeConfigData.surahBasicInfo;
  }

  console.warn("[quranMetadataService] Metadata from proxy/cache did not contain surahBasicInfo. Attempting direct API fallback for 'surah-list'.");
  try {
    const surahList = await fetchMetadataFromAPI<SurahBasicInfo[]>('surah-list');
    if (surahList && __DEV__ && (!localEdgeConfigData || !localEdgeConfigData.surahBasicInfo)) {
        localEdgeConfigData = { ...localEdgeConfigData, surahBasicInfo: surahList };
        console.info("[quranMetadataService] DEV: Populated localEdgeConfigData.surahBasicInfo with API result after proxy miss.");
    }
    return surahList;
  } catch (apiError) {
    console.error("[quranMetadataService] API error during fallback fetch for 'surah-list':", apiError);
    return null;
  }
}

export async function getSajdaVerses(): Promise<SajdaVerse[] | null> {
  // Sajda verses are typically not in the main quranMetadata Edge Config item, so fetch directly.
  try {
    const sajdaVerses = await fetchMetadataFromAPI<SajdaVerse[]>('sajdas');
    return sajdaVerses;
  } catch (apiError) {
    console.error("[quranMetadataService] API error fetching sajda verses:", apiError);
    return null;
  }
}

export async function getNavigationIndices(): Promise<NavigationIndices | null> {
  const metadata = await fetchAllMetadataFromProxy();

  if (metadata?.navigationIndices) {
    console.log("[quranMetadataService] Using navigationIndices from (proxy/cached) metadata.");
    return metadata.navigationIndices;
  }

  if (localEdgeConfigData?.navigationIndices) {
    console.log("[quranMetadataService] Using navigationIndices from localEdgeConfigData.");
    return localEdgeConfigData.navigationIndices;
  }
  
  console.warn("[quranMetadataService] Metadata from proxy/cache did not contain navigationIndices. Attempting direct API fallback for 'navigation-indices'.");
  try {
    const navIndices = await fetchMetadataFromAPI<NavigationIndices>('navigation-indices');
     if (navIndices && __DEV__ && (!localEdgeConfigData || !localEdgeConfigData.navigationIndices)) {
        localEdgeConfigData = { ...localEdgeConfigData, navigationIndices: navIndices };
        console.info("[quranMetadataService] DEV: Populated localEdgeConfigData.navigationIndices with API result after proxy miss.");
    }
    return navIndices;
  } catch (apiError) {
    console.error("[quranMetadataService] API error fetching 'navigation-indices':", apiError);
    return null;
  }
}