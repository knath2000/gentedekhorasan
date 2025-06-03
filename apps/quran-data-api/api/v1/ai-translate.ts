import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
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