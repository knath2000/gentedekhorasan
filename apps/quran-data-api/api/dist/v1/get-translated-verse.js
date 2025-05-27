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
    const { surah, ayah, translator } = req.query;
    const surahNum = parseInt(surah);
    const ayahNum = parseInt(ayah);
    if (isNaN(surahNum) || isNaN(ayahNum) || translator !== 'en.yusufali') {
        return res.status(400).json({ error: 'Invalid parameters' });
    }
    try {
        const [arabicVerse, translation] = await Promise.all([
            prisma_1.prisma.quranText.findFirst({
                where: { sura: surahNum, aya: ayahNum }
            }),
            prisma_1.prisma.enYusufali.findFirst({
                where: { sura: surahNum, aya: ayahNum }
            })
        ]);
        if (!arabicVerse && !translation) {
            return res.status(404).json({ error: 'Verse not found' });
        }
        return res.status(200).json({
            id: arabicVerse?.id || translation?.index || 0,
            surahId: surahNum,
            numberInSurah: ayahNum,
            text: arabicVerse?.text || '',
            translation: translation?.text || ''
        });
    }
    catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
}
