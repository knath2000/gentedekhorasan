import axios from 'axios';
import dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BibleVerse } from './types';

// Load environment variables from .env file
dotenv.config();

const API_KEY = process.env.API_BIBLE_KEY;
if (!API_KEY) {
  throw new Error('API_BIBLE_KEY is not defined in the .env file.');
}

const API_BASE_URL = 'https://api.scripture.api.bible/v1';
const BIBLE_ID = 'de4e12af7f28f599-01'; // BSB - Berean Standard Bible

// Data structure for New Testament books and their chapter counts
const NEW_TESTAMENT_BOOKS = {
  "MAT": 28, "MRK": 16, "LUK": 24, "JHN": 21, "ACT": 28, "ROM": 16, "1CO": 16,
  "2CO": 13, "GAL": 6, "EPH": 6, "PHP": 4, "COL": 4, "1TH": 5, "2TH": 3, "1TI": 6,
  "2TI": 4, "TIT": 3, "PHM": 1, "HEB": 13, "JAS": 5, "1PE": 5, "2PE": 3, "1JN": 5,
  "2JN": 1, "3JN": 1, "JUD": 1, "REV": 22
};

// Helper function to introduce a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function apiCall<T>(url: string): Promise<T> {
  const response = await axios.get(url, {
    headers: { 'api-key': API_KEY }
  });
  return response.data;
}

function extractTextFromNode(node: any): string {
  if (!node) return '';
  if (node.type === 'text') {
    return node.text || '';
  }
  if (node.type === 'tag' && Array.isArray(node.items)) {
    return node.items.map(extractTextFromNode).join('');
  }
  return '';
}

async function getChapterContent(bibleId: string, chapterId: string): Promise<BibleVerse[]> {
  console.log(`Fetching content for chapter ID: ${chapterId}`);
  const url = `${API_BASE_URL}/bibles/${bibleId}/chapters/${chapterId}?content-type=json&include-verse-numbers=true&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-spans=false`;
  
  try {
    const response = await apiCall<{ data: { content: any[], reference: string } }>(url);

    const debugOutputDir = 'output/debug';
    await fs.mkdir(debugOutputDir, { recursive: true });
    const debugOutputPath = path.join(debugOutputDir, `${chapterId}_raw_response.json`);
    await fs.writeFile(debugOutputPath, JSON.stringify(response.data, null, 2));
    
    const verses: BibleVerse[] = [];
    let currentVerseMetadata: Omit<BibleVerse, 'content'> | null = null;
    let accumulatedVerseText = '';

    if (response.data && Array.isArray(response.data.content)) {
      // **FIX:** Iterate through each paragraph in the content array
      for (const paragraph of response.data.content) {
        if (paragraph.type === 'tag' && Array.isArray(paragraph.items)) {
          // **FIX:** Iterate through the items (verses and text) within the paragraph
          for (const item of paragraph.items) {
            if (item.type === 'tag' && item.name === 'verse' && item.attrs && item.attrs['number']) {
              if (currentVerseMetadata && accumulatedVerseText.trim()) {
                verses.push({
                  ...currentVerseMetadata,
                  content: accumulatedVerseText.trim(),
                });
              }
              const verseNumberStr = item.attrs['number'];
              currentVerseMetadata = {
                id: `${chapterId}.${verseNumberStr}`,
                orgId: verseNumberStr,
                bibleId: bibleId,
                bookId: chapterId.split('.')[0],
                chapterId: chapterId,
                reference: `${response.data.reference}:${verseNumberStr}`,
                verseNumber: verseNumberStr,
              };
              accumulatedVerseText = '';
            } else if (currentVerseMetadata) {
              accumulatedVerseText += extractTextFromNode(item);
            }
          }
        }
      }
      // Add the last processed verse after the loops finish
      if (currentVerseMetadata && accumulatedVerseText.trim()) {
        verses.push({
          ...currentVerseMetadata,
          content: accumulatedVerseText.trim(),
        });
      }
    }
    return verses;
  } catch (error) {
    console.error(`Failed to fetch or parse chapter ${chapterId}:`, (error as any).message);
    return [];
  }
}

async function main() {
  console.log('Starting Bible data extraction...');
  const allVerses: BibleVerse[] = [];
  
  for (const [bookId, chapterCount] of Object.entries(NEW_TESTAMENT_BOOKS)) {
    for (let i = 1; i <= chapterCount; i++) {
      const chapterId = `${bookId}.${i}`;
      const verses = await getChapterContent(BIBLE_ID, chapterId);
      allVerses.push(...verses);
      
      await delay(200);
    }
  }
  
  const outputDir = 'output';
  await fs.mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'bsb_new_testament_verses.json');
  
  await fs.writeFile(outputPath, JSON.stringify(allVerses, null, 2));
  
  console.log(`Extraction complete. ${allVerses.length} verses saved to ${outputPath}`);
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
});
