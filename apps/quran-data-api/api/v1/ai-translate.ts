import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Validate request parameters
  const { surah, ayah, text } = req.query
  if (!surah || !ayah || !text) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }

  try {
    // Create translation prompt
    const prompt = `Translate this Quran verse from Arabic to English with high accuracy and respect for religious context:\n\n${text}`

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const translation = data.choices[0].message.content

    return res.status(200).json({ 
      surah: parseInt(surah as string),
      ayah: parseInt(ayah as string),
      translation 
    })
  } catch (error) {
    console.error('Gemini API error:', error)
    return res.status(500).json({ error: 'Translation failed' })
  }
}
