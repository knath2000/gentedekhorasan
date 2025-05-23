import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../lib/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { type } = req.query

  try {
    switch (type) {
      case 'surah-list':
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
            rukus: true
          }
        })
        return res.status(200).json(surahs.map(s => ({
          number: s.number,
          name: s.arabicName,
          tname: s.transliteration,
          ename: s.englishName,
          ayas: s.ayas,
          type: s.revelationType,
          order: s.chronologicalOrder,
          rukus: s.rukus
        })))
      
      case 'sajdas':
        const sajdas = await prisma.quranSajda.findMany({
          orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }]
        })
        return res.status(200).json(sajdas)
      
      default:
        return res.status(400).json({ error: 'Invalid metadata type' })
    }
  } catch (error) {
    console.error('Database error:', error)
    return res.status(500).json({ error: 'Database error' })
  }
}