import { verifyToken } from '@clerk/backend';
import { PrismaLibSQL } from '@prisma/adapter-libsql'; // Import PrismaLibSQL
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '../../prisma/generated/client';

// ✅ CONFIGURACIÓN CORRECTA PARA TURSO
const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
const prisma = new PrismaClient({ adapter });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS logic (mantener como está)...
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
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With'); // Add X-Requested-With
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight por 24 horas

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('=== PREFLIGHT REQUEST ===');
    console.log('Origin:', req.headers.origin);
    console.log('Access-Control-Request-Headers:', req.headers['access-control-request-headers']);
    return res.status(200).end();
  }

  try {
    console.log('=== TURSO CONNECTION DEBUG ===');
    console.log('TURSO_DATABASE_URL present:', !!process.env.TURSO_DATABASE_URL);
    console.log('TURSO_AUTH_TOKEN present:', !!process.env.TURSO_AUTH_TOKEN);
    console.log('TURSO_DATABASE_URL starts with:', process.env.TURSO_DATABASE_URL?.substring(0, 20));
    
    // Test connection
    console.log('Testing TursoDB connection...');
    await prisma.$connect();
    console.log('TursoDB connected successfully');
    
    // ... resto del código de autenticación igual
    
    const authHeader = req.headers.authorization;
    let userId: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const verifiedToken = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY!
        });
        userId = verifiedToken.sub;
        console.log('Manual verification success:', userId);
      } catch (verifyError: any) {
        console.error('Manual verification failed:', verifyError.message);
      }
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
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
        console.log('=== POST REQUEST DEBUG ===');
        console.log('Request body:', req.body);
        console.log('User ID:', userId);
        
        const { surahId, verseNumber, verseText, surahName, translation, notes } = req.body;
        
        // ✅ VALIDACIÓN DETALLADA
        console.log('Extracted fields:', {
          surahId: surahId,
          verseNumber: verseNumber,
          verseText: verseText ? (verseText as string).substring(0, 50) + '...' : 'MISSING',
          surahName: surahName,
          translation: translation ? (translation as string).substring(0, 50) + '...' : 'MISSING',
          notes: notes
        });
        
        if (!surahId || !verseNumber || !verseText || !surahName || !translation) {
          console.log('Missing required fields validation failed');
          return res.status(400).json({
            error: 'Missing required fields',
            received: { surahId, verseNumber, verseText: !!verseText, surahName, translation: !!translation }
          });
        }
        
        // ✅ VERIFICAR CONEXIÓN PRISMA
        console.log('Testing Prisma connection...');
        // await prisma.$connect(); // No es necesario llamar a $connect explícitamente en cada request
        console.log('Prisma connection assumed to be active.');
        
        // ✅ VERIFICAR DUPLICATE CONSTRAINT
        console.log('Checking for existing bookmark...');
        const existingBookmark = await prisma.userBookmark.findFirst({
          where: {
            userId: userId,
            surahId: surahId,
            verseNumber: verseNumber
          }
        });
        
        if (existingBookmark) {
          console.log('Bookmark already exists:', existingBookmark.id);
          return res.status(409).json({
            error: 'Bookmark already exists',
            existingId: existingBookmark.id
          });
        }
        
        // ✅ CREAR BOOKMARK CON LOGGING DETALLADO
        console.log('Creating bookmark with data:', {
          userId,
          surahId,
          verseNumber,
          verseText: (verseText as string).substring(0, 50) + '...',
          surahName,
          translation: (translation as string).substring(0, 50) + '...',
          notes: notes || ''
        });
        
        const bookmark = await prisma.userBookmark.create({
          data: {
            userId,
            surahId,
            verseNumber,
            verseText: verseText as string,
            surahName: surahName as string,
            translation: translation as string,
            notes: notes || ''
          }
        });
        
        console.log('Bookmark created successfully:', bookmark.id);
        return res.status(201).json(bookmark);
        
      } catch (error: any) {
        console.error('=== POST ERROR DETAILS ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // ✅ ERRORES ESPECÍFICOS DE PRISMA
        if (error.code) {
          console.error('Prisma error code:', error.code);
          console.error('Prisma error meta:', error.meta);
        }
        
        // ✅ RESPUESTA DE ERROR DETALLADA
        return res.status(500).json({
          error: 'Failed to create bookmark',
          details: error.message,
          code: error.code || 'UNKNOWN'
        });
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