import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '../../prisma/generated/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS DINÁMICO
  const allowedOrigins = [
    'https://quranexpo-web.vercel.app',
    'http://localhost:4321',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get userId directly from headers (Clerk injects this)
    const userId = req.headers['x-clerk-user-id'] as string | undefined;

    if (!userId) {
      console.warn('Unauthorized access attempt: No x-clerk-user-id header found.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      try {
        const bookmarks = await prisma.userBookmark.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(bookmarks);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        return res.status(500).json({ error: 'Failed to fetch bookmarks' });
      }
    }

    if (req.method === 'POST') {
      try {
        const { surahId, verseNumber, verseText, surahName, translation, notes } = req.body;
        if (!surahId || !verseNumber || !verseText || !surahName || !translation) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const bookmark = await prisma.userBookmark.create({
          data: { userId, surahId, verseNumber, verseText, surahName, translation, notes }
        });
        return res.status(201).json(bookmark);
      } catch (error) {
        console.error('Error creating bookmark:', error);
        return res.status(500).json({ error: 'Failed to create bookmark' });
      }
    }

    if (req.method === 'PUT') {
      try {
        const { id } = req.query;
        const { notes } = req.body;
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Bookmark ID is required' });
        }
        const bookmark = await prisma.userBookmark.updateMany({
          where: { id, userId },
          data: { notes }
        });
        if (bookmark.count === 0) {
          return res.status(404).json({ error: 'Bookmark not found or unauthorized' });
        }
        return res.status(200).json({ message: 'Bookmark updated successfully' });
      } catch (error) {
        console.error('Error updating bookmark:', error);
        return res.status(500).json({ error: 'Failed to update bookmark' });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const { id } = req.query;
        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Bookmark ID is required' });
        }
        const bookmark = await prisma.userBookmark.deleteMany({
          where: { id, userId }
        });
        if (bookmark.count === 0) {
          return res.status(404).json({ error: 'Bookmark not found or unauthorized' });
        }
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting bookmark:', error);
        return res.status(500).json({ error: 'Failed to delete bookmark' });
      }
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
    
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}