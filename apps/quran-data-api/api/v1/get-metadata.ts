import type { VercelRequest, VercelResponse } from '@vercel/node';
import { QuranSurah } from '../../prisma/generated/client'; // Import from generated client path
import { setCorsHeaders } from '../lib/cors';
import { prisma } from '../lib/prisma';


export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('get-metadata API handler invoked.');

  setCorsHeaders(req, res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type } = req.query

  try {
    switch (type) {
      case 'surah-list':
        console.log('Fetching surah-list...');
        const surahs = await prisma.quranSurah.findMany({
          orderBy: { number: 'asc' },
          select: {
            number: true,
            arabicName: true,
            transliteration: true,
            englishName: true,
            ayas: true,
            revelationType: true,
            chronologicalOrder: true,
            rukus: true,
            startIndex: true
          },
        })
        console.log('Successfully fetched surahs.');
        return res.status(200).json(surahs.map((s: QuranSurah) => ({
          number: s.number,
          name: s.arabicName,
          tname: s.transliteration,
          ename: s.englishName,
          ayas: s.ayas,
          type: s.revelationType,
          order: s.chronologicalOrder,
          rukus: s.rukus,
          startIndex: s.startIndex
        })));
      
      case 'sajdas':
        console.log('Fetching sajdas...');
        const sajdas = await prisma.quranSajda.findMany({
          orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }]
        })
        console.log('Successfully fetched sajdas.');
        return res.status(200).json(sajdas);
      
      default:
        console.warn('Invalid metadata type:', type);
        return res.status(400).json({ error: 'Invalid metadata type' });
    }
  } catch (error: any) {
    console.error('API Error in get-metadata:', error.message || error);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return res.status(500).json({ error: 'Internal Server Error', details: error.message || 'Unknown error' });
  } finally {
    // await prisma.$disconnect(); // Disconnecting is not recommended for serverless functions with connection pooling
  }
}