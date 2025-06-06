"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const prisma_1 = require("../lib/prisma");
async function handler(req, res) {
    console.log('get-metadata API handler invoked.');
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
                console.log('Fetching surah-list...');
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
                    },
                    // Add a timeout to the query
                    // @ts-ignore
                    timeout: 5000 // 5 seconds timeout
                });
                console.log('Successfully fetched surahs.');
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
                console.log('Fetching sajdas...');
                const sajdas = await prisma_1.prisma.quranSajda.findMany({
                    orderBy: [{ surahNumber: 'asc' }, { ayahNumber: 'asc' }],
                    // @ts-ignore
                    timeout: 5000 // 5 seconds timeout
                });
                console.log('Successfully fetched sajdas.');
                return res.status(200).json(sajdas);
            default:
                console.warn('Invalid metadata type:', type);
                return res.status(400).json({ error: 'Invalid metadata type' });
        }
    }
    catch (error) {
        console.error('API Error in get-metadata:', error.message || error);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        return res.status(500).json({ error: 'Internal Server Error', details: error.message || 'Unknown error' });
    }
    finally {
        await prisma_1.prisma.$disconnect(); // Always disconnect
    }
}
