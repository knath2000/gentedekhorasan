import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../lib/cors';
import { prisma } from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { surah, ayah, translator } = req.query
  
  const surahNum = parseInt(surah as string)
  const ayahNum = parseInt(ayah as string)

  if (isNaN(surahNum) || isNaN(ayahNum) || translator !== 'en.yusufali') {
    return res.status(400).json({ error: 'Invalid parameters' })
  }

  try {
    const [arabicVerse, translation] = await Promise.all([
      prisma.quranText.findFirst({
        where: { sura: surahNum, aya: ayahNum }
      }),
      prisma.enYusufali.findFirst({
        where: { sura: surahNum, aya: ayahNum }
      })
    ])

    if (!arabicVerse && !translation) {
      return res.status(404).json({ error: 'Verse not found' })
    }

    return res.status(200).json({
      id: arabicVerse?.id || translation?.index || 0,
      surahId: surahNum,
      numberInSurah: ayahNum,
      text: arabicVerse?.text || '',
      translation: translation?.text || ''
    })
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ error: 'Database error' })
  }
}