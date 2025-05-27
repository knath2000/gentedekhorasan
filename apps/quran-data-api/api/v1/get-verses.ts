import type { VercelRequest, VercelResponse } from '@vercel/node';
import { QuranText } from '../../prisma/generated/client'; // Import from generated client path
import { prisma } from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for development
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { surah } = req.query
  const surahNumber = parseInt(surah as string)

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return res.status(400).json({ error: 'Invalid surah number' })
  }

  try {
    const verses = await prisma.quranText.findMany({
      where: { sura: surahNumber },
      orderBy: { aya: 'asc' },
      select: {
        id: true,
        sura: true,
        aya: true,
        text: true
      }
    })

    const response = verses.map((verse: QuranText) => ({ // Use the directly imported type
      id: verse.id,
      surahId: verse.sura,
      numberInSurah: verse.aya,
      text: verse.text
    }))

    return res.status(200).json(response)
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ error: 'Database error' })
  }
}