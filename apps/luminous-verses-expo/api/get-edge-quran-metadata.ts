import { createClient, EdgeConfigClient } from '@vercel/edge-config';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*'); // Adjust to your specific domain in production
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cache-Control'
  );

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (!process.env.EDGE_CONFIG) {
    console.error('[API get-edge-quran-metadata] EDGE_CONFIG env var not set.');
    return response.status(500).json({ error: 'Server configuration error for Edge Config.' });
  }

  try {
    // Ensure EDGE_CONFIG is a string, createClient expects a string.
    const edgeConfigConnectionString = process.env.EDGE_CONFIG;
    if (typeof edgeConfigConnectionString !== 'string') {
        console.error('[API get-edge-quran-metadata] EDGE_CONFIG is not a string.');
        return response.status(500).json({ error: 'Server configuration error: EDGE_CONFIG format invalid.' });
    }

    const edgeConfigClient: EdgeConfigClient = createClient(edgeConfigConnectionString);
    const metadata = await edgeConfigClient.get('quranMetadata'); // 'quranMetadata' is the key for your item

    if (metadata === undefined) {
      console.warn('[API get-edge-quran-metadata] quranMetadata item not found in Edge Config or returned undefined.');
      return response.status(404).json({ error: 'Quran metadata not found in Edge Config.' });
    }
    
    return response.status(200).json(metadata);
  } catch (error) {
    console.error('[API get-edge-quran-metadata] Error fetching from Edge Config:', error);
    const message = (typeof error === 'object' && error !== null && 'message' in error) ? (error as {message: string}).message : 'Unknown error';
    return response.status(500).json({ error: 'Failed to fetch Quran metadata from Edge Config.', details: message });
  }
}