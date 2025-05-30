import { verifyToken } from '@clerk/backend'; // Import verifyToken
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
    console.log('=== CLERK DEBUG START ===');
    console.log('Environment variables:');
    console.log('- CLERK_SECRET_KEY present:', !!process.env.CLERK_SECRET_KEY);
    console.log('- CLERK_SECRET_KEY length:', process.env.CLERK_SECRET_KEY?.length);
    console.log('- CLERK_SECRET_KEY starts with:', process.env.CLERK_SECRET_KEY?.substring(0, 10));
    
    console.log('Request details:');
    console.log('- Authorization header:', req.headers.authorization);
    console.log('- Origin:', req.headers.origin);
    console.log('- User-Agent:', req.headers['user-agent']);
    
    // Método 1: Usar x-clerk-user-id header
    console.log('=== TRYING x-clerk-user-id header ===');
    let userId: string | undefined = req.headers['x-clerk-user-id'] as string | undefined;
    console.log('x-clerk-user-id result:', userId);
    
    // Método 2: Verificar token manualmente si x-clerk-user-id no está presente o para depuración
    if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('=== TRYING manual token verification ===');
      const token = req.headers.authorization.substring(7);
      console.log('Token extracted, length:', token.length);
      console.log('Token start:', token.substring(0, 50));
      
      try {
        const verifiedToken = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY!
        });
        userId = verifiedToken.sub;
        console.log('Manual verification success:', userId);
        console.log('Token claims:', verifiedToken);
      } catch (verifyError: any) {
        console.error('Manual verification failed:', verifyError.message);
        console.error('Verify error details:', verifyError);
      }
    }
    
    if (!userId) {
      console.log('=== AUTH FAILED ===');
      return res.status(401).json({ 
        error: 'Unauthorized',
        debug: {
          hasAuthHeader: !!req.headers.authorization,
          clerkSecretKeyPresent: !!process.env.CLERK_SECRET_KEY,
          method: 'no_user_id_found'
        }
      });
    }
    
    console.log('=== AUTH SUCCESS ===');
    console.log('Authenticated user:', userId);

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
    
  } catch (error: any) {
    console.error('=== HANDLER ERROR ===', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}