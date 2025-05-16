import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool as PgPool } from 'pg';

const dbPool = new PgPool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 10000,
});

dbPool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client in pool (get-translated-verse)', err);
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[API-SingleTranslatedVerse] Request received: ${req.url}`);
  console.log(`[API-SingleTranslatedVerse] Query parameters: ${JSON.stringify(req.query)}`);

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  const surahQuery = req.query.surah;
  const ayahQuery = req.query.ayah;
  const translationKey = req.query.translator;

  if (!surahQuery || typeof surahQuery !== 'string' || !ayahQuery || typeof ayahQuery !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "surah" or "ayah" query parameters.' });
  }

  if (!translationKey || typeof translationKey !== 'string' || translationKey !== 'en.yusufali') {
    return res.status(400).json({ error: 'Missing or invalid "translator" query parameter. Currently only "en.yusufali" is supported.' });
  }
  const translationTableName = "en_yusufali"; // Hardcoded for now

  const surah = parseInt(surahQuery, 10);
  const ayah = parseInt(ayahQuery, 10);

  if (isNaN(surah) || surah < 1 || surah > 114 || isNaN(ayah) || ayah < 1) { // Basic validation
    return res.status(400).json({ error: 'Invalid "surah" or "ayah" number.' });
  }

  let client;
  try {
    client = await dbPool.connect();
    console.log("[API-SingleTranslatedVerse] Successfully connected to database");

    // Fetch Arabic verse
    const arabicQuery = 'SELECT id, sura, aya, text FROM quran_text WHERE sura = $1 AND aya = $2 LIMIT 1';
    console.log(`[API-SingleTranslatedVerse] Executing Arabic query: ${arabicQuery} with params: [${surah}, ${ayah}]`);
    const arabicResult = await client.query(arabicQuery, [surah, ayah]);
    
    let arabicVerseData = null;
    if (arabicResult.rows.length > 0) {
      arabicVerseData = arabicResult.rows[0];
      console.log(`[API-SingleTranslatedVerse] Arabic verse found: S${surah}:A${ayah}`);
    } else {
      console.warn(`[API-SingleTranslatedVerse] Arabic verse NOT found for S${surah}:A${ayah}`);
    }

    // Fetch Translation verse
    // The 'en_yusufali' table uses 'index' as its primary key (global verse ID), 
    // but we query by sura and aya for consistency and to match quran_text.
    const translationQuery = `SELECT "index", sura, aya, text FROM ${translationTableName} WHERE sura = $1 AND aya = $2 LIMIT 1`;
    console.log(`[API-SingleTranslatedVerse] Executing Translation query: ${translationQuery} with params: [${surah}, ${ayah}]`);
    const translationResult = await client.query(translationQuery, [surah, ayah]);

    let translationText = null;
    if (translationResult.rows.length > 0) {
      translationText = translationResult.rows[0].text;
      console.log(`[API-SingleTranslatedVerse] Translation found for S${surah}:A${ayah}`);
    } else {
      console.warn(`[API-SingleTranslatedVerse] Translation NOT found for S${surah}:A${ayah} in ${translationTableName}`);
    }

    if (!arabicVerseData && !translationText) {
      return res.status(404).json({ error: `Verse ${surah}:${ayah} not found (neither Arabic nor translation).` });
    }
    
    // Combine results
    // The 'id' from quran_text is the global verse ID.
    // If arabicVerseData is null, we might still have translation, use translation's sura/aya.
    const responseVerse = {
      id: arabicVerseData ? parseInt(arabicVerseData.id, 10) : (translationResult.rows.length > 0 ? parseInt(translationResult.rows[0].index, 10) : 0),
      surahId: arabicVerseData ? parseInt(arabicVerseData.sura, 10) : surah,
      numberInSurah: arabicVerseData ? parseInt(arabicVerseData.aya, 10) : ayah,
      text: arabicVerseData ? arabicVerseData.text : '', // Arabic text
      translation: translationText || '', // Translation text
    };
    
    return res.status(200).json(responseVerse);

  } catch (err: any) {
    console.error(`[API-SingleTranslatedVerse] Detailed error for S${surah}:A${ayah}:`, {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    return res.status(500).json({
      error: 'Database error while fetching single translated verse',
      details: err.message,
      code: err.code 
    });
  } finally {
    if (client) {
      console.log("[API-SingleTranslatedVerse] Releasing database connection");
      client.release();
    }
  }
}