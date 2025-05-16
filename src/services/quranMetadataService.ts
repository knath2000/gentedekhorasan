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


const edgeConfigConnectionString = process.env.EDGE_CONFIG;
let edgeConfigClient: EdgeConfigClient | undefined;

if (edgeConfigConnectionString) {
  try {
    edgeConfigClient = createClient(edgeConfigConnectionString);
  } catch (error) {
    console.error("Failed to create Edge Config client:", error);
    console.warn("Edge Config functionality in quranMetadataService will not be available.");
  }
} else {
  console.warn("EDGE_CONFIG connection string not found. Edge Config functionality will not be available.");
}


// Use Edge Config with API fallback instead of DB fallback
export async function getBasicSurahList(): Promise<SurahBasicInfo[] | null> {
  if (edgeConfigClient) {
    try {
      const metadata = await edgeConfigClient.get('quranMetadata') as QuranEdgeConfigData | undefined;
      if (metadata && typeof metadata === 'object' && metadata.surahBasicInfo) {
        return metadata.surahBasicInfo;
      }
      console.warn('surahBasicInfo not found or metadata is not in expected format in Edge Config, attempting API fallback.');
    } catch (error) {
      console.error('Edge Config error in getBasicSurahList, falling back to API:', error);
      // Fall through to API fallback
    }
  } else {
    console.warn("Edge Config client not available, attempting API fallback for getBasicSurahList.");
  }
  
  // Fallback to API instead of direct DB connection
  try {
    const surahList = await fetchMetadataFromAPI<SurahBasicInfo[]>('surah-list');
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
        return metadata.navigationIndices;
      }
      console.warn('navigationIndices not found or metadata is not in expected format in Edge Config, attempting API fallback.');
    } catch (error) {
      console.error('Edge Config error in getNavigationIndices, falling back to API:', error);
      // Fall through to API fallback
    }
  } else {
     console.warn("Edge Config client not available, attempting API fallback for getNavigationIndices.");
  }
  
  // Fallback to API for navigation indices if available
  try {
    // Assuming 'navigation-indices' is a valid type for your get-metadata API endpoint
    const navigationIndices = await fetchMetadataFromAPI<NavigationIndices>('navigation-indices');
    return navigationIndices;
  } catch (apiError) {
    console.error("API error fetching navigation indices:", apiError);
    return null;
  }
}