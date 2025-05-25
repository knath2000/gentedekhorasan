import type { APIRoute } from 'astro';
import { get } from '@vercel/edge-config';

export const config = {
  runtime: 'edge',
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const quranMetadata = await get('quranMetadata'); // Obtener el objeto quranMetadata
    
    if (!quranMetadata || typeof quranMetadata !== 'object' || !('surahBasicInfo' in quranMetadata)) {
      return new Response(JSON.stringify({ message: 'Quran metadata or surahBasicInfo not found in Edge Config' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const surahBasicInfo = (quranMetadata as any).surahBasicInfo; // Acceder a surahBasicInfo
    
    // Mapear surahBasicInfo a un objeto plano de number: tname
    const transliterations: Record<string, string> = {};
    if (Array.isArray(surahBasicInfo)) {
      surahBasicInfo.forEach((surah: any) => {
        if (surah.number && surah.tname) {
          transliterations[surah.number.toString()] = surah.tname;
        }
      });
    }

    console.log('Transliterations fetched from Edge Config:', transliterations); // Debug log

    return new Response(JSON.stringify(transliterations), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Error fetching transliterations from Edge Config:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};