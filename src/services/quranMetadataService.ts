import { createClient, EdgeConfigClient } from '@vercel/edge-config';
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

// Example of how to get navigation indices (e.g., Juz starts) from Edge Config
interface NavigationIndexItem {
  surah: number;
  aya: number;
}

interface NavigationIndices {
  juzStarts?: Record<string, NavigationIndexItem>;
  pageStarts?: Record<string, NavigationIndexItem>;
  // Add other indices as needed
}


let edgeConfigClient: EdgeConfigClient | undefined; // Existing line, kept for context, search starts effectively below
let localEdgeConfigData: QuranEdgeConfigData | undefined;

// Initialize Edge Config or local fallback
if (process.env.EDGE_CONFIG) {
  try {
    edgeConfigClient = createClient(process.env.EDGE_CONFIG);
  } catch (error) {
    console.error("Failed to create Edge Config client:", error);
    initializeLocalFallback(); // Call fallback
  }
} else {
  console.warn("EDGE_CONFIG connection string not found. Using local fallback data.");
  initializeLocalFallback(); // Call fallback
}

// Function to initialize local fallback data
async function initializeLocalFallback() {
  try {
    // If in development, try to load local data
    if (__DEV__) { // __DEV__ is a global variable typically available in React Native development mode
      // First try API
      const surahList = await fetchMetadataFromAPI<SurahBasicInfo[]>('surah-list');
      if (surahList) {
        localEdgeConfigData = { surahBasicInfo: surahList };
        console.info("Using API data as local Edge Config fallback for surahBasicInfo");
        return;
      }
      
      // If API fails, use static data if available
      // This could be imported from a local JSON file
      // import localDataFromFile from './local-edge-config-data.json'; // Ensure this file exists and is typed
      // if (localDataFromFile) {
      //   localEdgeConfigData = localDataFromFile as QuranEdgeConfigData;
      //   console.info("Using local JSON file as Edge Config fallback.");
      // }
    }
  } catch (error) {
    console.error("Failed to initialize local fallback data:", error);
  }
}


// Use Edge Config with API fallback instead of DB fallback
export async function getBasicSurahList(): Promise<SurahBasicInfo[] | null> {
  if (edgeConfigClient) {
    try {
      const metadata = await edgeConfigClient.get('quranMetadata') as QuranEdgeConfigData | undefined;
      if (metadata && typeof metadata === 'object' && metadata.surahBasicInfo) {
        console.log("Fetched surahBasicInfo from Edge Config.");
        return metadata.surahBasicInfo;
      }
      console.warn('surahBasicInfo not found or metadata is not in expected format in Edge Config.');
    } catch (error) {
      console.error('Edge Config error in getBasicSurahList:', error);
    }
  }

  // Try local fallback if Edge Config client failed or didn't return data
  if (localEdgeConfigData?.surahBasicInfo) {
    console.log("Using pre-loaded localEdgeConfigData for surahBasicInfo.");
    return localEdgeConfigData.surahBasicInfo;
  }
  
  console.warn("Edge Config client not available or data not found, and no local fallback. Attempting API fetch for getBasicSurahList.");
  // Fallback to API if Edge Config and local fallback are not available/successful
  try {
    const surahList = await fetchMetadataFromAPI<SurahBasicInfo[]>('surah-list');
    if (surahList && __DEV__ && (!localEdgeConfigData || !localEdgeConfigData.surahBasicInfo)) {
        localEdgeConfigData = { ...localEdgeConfigData, surahBasicInfo: surahList };
        console.info("Populated localEdgeConfigData with API result for surahBasicInfo.");
    }
    return surahList;
  } catch (apiError) {
    console.error("API error fetching basic surah list:", apiError);
    return null;
  }
}

// Similar approach for other functions
export async function getSajdaVerses(): Promise<SajdaVerse[] | null> {
  // Sajda verses might not be in Edge Config, so directly try API
  try {
    const sajdaVerses = await fetchMetadataFromAPI<SajdaVerse[]>('sajdas');
    return sajdaVerses;
  } catch (apiError) {
    console.error("API error fetching sajda verses:", apiError);
    return null;
  }
}

export async function getNavigationIndices(): Promise<NavigationIndices | null> {
  if (edgeConfigClient) {
    try {
      const metadata = await edgeConfigClient.get('quranMetadata') as QuranEdgeConfigData | undefined;
      if (metadata && typeof metadata === 'object' && metadata.navigationIndices) {
        console.log("Fetched navigationIndices from Edge Config.");
        return metadata.navigationIndices;
      }
      console.warn('navigationIndices not found or metadata is not in expected format in Edge Config.');
    } catch (error) {
      console.error('Edge Config error in getNavigationIndices:', error);
    }
  }

  // Try local fallback if Edge Config client failed or didn't return data
  if (localEdgeConfigData?.navigationIndices) {
    console.log("Using pre-loaded localEdgeConfigData for navigationIndices.");
    return localEdgeConfigData.navigationIndices;
  }

  console.warn("Edge Config client not available or data not found, and no local fallback. Attempting API fetch for getNavigationIndices.");
  // Fallback to API if Edge Config and local fallback are not available/successful
  try {
    const navigationIndices = await fetchMetadataFromAPI<NavigationIndices>('navigation-indices');
    if (navigationIndices && __DEV__ && (!localEdgeConfigData || !localEdgeConfigData.navigationIndices)) {
        localEdgeConfigData = { ...localEdgeConfigData, navigationIndices: navigationIndices };
        console.info("Populated localEdgeConfigData with API result for navigationIndices.");
    }
    return navigationIndices;
  } catch (apiError) {
    console.error("API error fetching navigation indices:", apiError);
    return null;
  }
}