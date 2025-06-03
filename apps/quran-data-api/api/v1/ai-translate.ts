import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'; // Importar ClerkExpressRequireAuth
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Aplicar el middleware de autenticación de Clerk
  const requireAuth = ClerkExpressRequireAuth();
  await new Promise((resolve, reject) => {
    requireAuth(request, response, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve(null);
    });
  }).catch(err => {
    console.error('Clerk authentication error:', err);
    // Si la autenticación falla, Clerk ya debería haber enviado una respuesta 401/403.
    // Si no, enviamos una respuesta de error genérica.
    if (!response.headersSent) {
      return response.status(401).json({ error: 'Unauthorized', details: err.message });
    }
    return; // Salir si la respuesta ya fue enviada
  });

  // Si la respuesta ya fue enviada por el middleware de Clerk, salir
  if (response.headersSent) {
    return;
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { verseText, surahId, verseNumber } = request.body;

  if (!verseText || !surahId || !verseNumber) {
    return response.status(400).json({ error: 'Missing required parameters: verseText, surahId, or verseNumber' });
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    return response.status(500).json({ error: 'OPENROUTER_API_KEY is not configured.' });
  }

  try {
    const prompt = `Translate the following Quranic verse into modern English, focusing on clarity and meaning. Provide only the translation text, without any additional commentary, verse numbers, or surah names.
    
    Surah: ${surahId}, Verse: ${verseNumber}
    Original Arabic Text: ${verseText}`;

    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!openrouterResponse.ok) {
      const errorData = await openrouterResponse.json();
      console.error('OpenRouter API error:', errorData);
      return response.status(openrouterResponse.status).json({ error: 'Failed to fetch AI translation', details: errorData });
    }

    const data = await openrouterResponse.json();
    const aiTranslation = data.choices[0]?.message?.content;

    if (!aiTranslation) {
      return response.status(500).json({ error: 'No AI translation content received.' });
    }

    response.status(200).json({ translation: aiTranslation });

  } catch (error) {
    console.error('Error in AI translation API:', error);
    response.status(500).json({ error: 'Internal Server Error during AI translation.' });
  }
}