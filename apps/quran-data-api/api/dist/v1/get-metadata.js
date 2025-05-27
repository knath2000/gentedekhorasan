"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const prisma_1 = require("../lib/prisma");
async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for development
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    const { type } = req.query;
    try {
        switch (type) {
            case 'surah-list':
                const surahs = await prisma_1.prisma.quranSurah.findMany({
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
                    }
                });
                return res.status(200).json(surahs.map((s) => ({
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
                const sajdas = await prisma_1.prisma.quranSajda.findMany({
                    orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }]
                });
                return res.status(200).json(sajdas);
            default:
                return res.status(400).json({ error: 'Invalid metadata type' });
        }
    }
    catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
}
