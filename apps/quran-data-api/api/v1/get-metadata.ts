import type { VercelRequest, VercelResponse } from '@vercel/node';
import { QuranSurah } from '../../prisma/generated/client'; // Import from generated client path
import { prisma } from '../lib/prisma';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('get-metadata API handler invoked.');

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for development
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

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
          // Add a timeout to the query
          // @ts-ignore
          timeout: 5000 // 5 seconds timeout
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
          orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }],
          // @ts-ignore
          timeout: 5000 // 5 seconds timeout
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
    await prisma.$disconnect(); // Always disconnect
  }
}