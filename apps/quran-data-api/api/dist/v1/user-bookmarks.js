"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const backend_1 = require("@clerk/backend");
const prisma_1 = require("../lib/prisma");
async function handler(req, res) {
    // CORS DINÁMICO
    const allowedOrigins = [
        'https://quranastroweb.vercel.app',
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
        console.log('=== REQUEST DEBUG ===');
        console.log('Method:', req.method);
        console.log('Origin:', req.headers.origin);
        console.log('All headers:', Object.keys(req.headers));
        console.log('Authorization header:', req.headers.authorization);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('=== CLERK DEBUG START ===');
        console.log('Environment variables:');
        console.log('- CLERK_SECRET_KEY present:', !!process.env.CLERK_SECRET_KEY);
        console.log('- CLERK_SECRET_KEY length:', process.env.CLERK_SECRET_KEY?.length);
        console.log('- CLERK_SECRET_KEY starts with:', process.env.CLERK_SECRET_KEY?.substring(0, 10));
        // Método 1: Usar x-clerk-user-id header
        console.log('=== TRYING x-clerk-user-id header ===');
        let userId = req.headers['x-clerk-user-id'];
        console.log('x-clerk-user-id result:', userId);
        // Método 2: Verificar token manualmente si x-clerk-user-id no está presente o para depuración
        if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            console.log('=== TRYING manual token verification ===');
            const token = req.headers.authorization.substring(7);
            console.log('Token extracted, length:', token.length);
            console.log('Token start:', token.substring(0, 50));
            try {
                const verifiedToken = await (0, backend_1.verifyToken)(token, {
                    secretKey: process.env.CLERK_SECRET_KEY
                });
                userId = verifiedToken.sub;
                console.log('Manual verification success:', userId);
                console.log('Token claims:', verifiedToken);
            }
            catch (verifyError) {
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
                const bookmarks = await prisma_1.prisma.userBookmark.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'desc' }
                });
                return res.status(200).json(bookmarks);
            }
            catch (error) {
                console.error('Error fetching bookmarks:', error);
                return res.status(500).json({ error: 'Failed to fetch bookmarks' });
            }
            finally {
                // await prisma.$disconnect(); // Disconnecting is not recommended for serverless functions with connection pooling
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
                    verseText: verseText ? verseText.substring(0, 50) + '...' : 'MISSING',
                    surahName: surahName,
                    translation: translation ? translation.substring(0, 50) + '...' : 'MISSING',
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
                const existingBookmark = await prisma_1.prisma.userBookmark.findFirst({
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
                    verseText: verseText.substring(0, 50) + '...',
                    surahName,
                    translation: translation.substring(0, 50) + '...',
                    notes: notes || ''
                });
                const bookmark = await prisma_1.prisma.userBookmark.create({
                    data: {
                        userId,
                        surahId,
                        verseNumber,
                        verseText: verseText,
                        surahName: surahName,
                        translation: translation,
                        notes: notes || ''
                    }
                });
                console.log('Bookmark created successfully:', bookmark.id);
                return res.status(201).json(bookmark);
            }
            catch (error) {
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
            finally {
                // await prisma.$disconnect(); // Disconnecting is not recommended for serverless functions with connection pooling
            }
        }
        if (req.method === 'PUT') {
            try {
                const { id } = req.query;
                const { notes } = req.body;
                if (!id || typeof id !== 'string') {
                    return res.status(400).json({ error: 'Bookmark ID is required' });
                }
                const bookmark = await prisma_1.prisma.userBookmark.updateMany({
                    where: { id, userId },
                    data: { notes }
                });
                if (bookmark.count === 0) {
                    return res.status(404).json({ error: 'Bookmark not found or unauthorized' });
                }
                return res.status(200).json({ message: 'Bookmark updated successfully' });
            }
            catch (error) {
                console.error('Error updating bookmark:', error);
                return res.status(500).json({ error: 'Failed to update bookmark' });
            }
            finally {
                // await prisma.$disconnect(); // Disconnecting is not recommended for serverless functions with connection pooling
            }
        }
        if (req.method === 'DELETE') {
            try {
                const { id } = req.query;
                if (!id || typeof id !== 'string') {
                    return res.status(400).json({ error: 'Bookmark ID is required' });
                }
                const bookmark = await prisma_1.prisma.userBookmark.deleteMany({
                    where: { id, userId }
                });
                if (bookmark.count === 0) {
                    return res.status(404).json({ error: 'Bookmark not found or unauthorized' });
                }
                return res.status(204).end();
            }
            catch (error) {
                console.error('Error deleting bookmark:', error);
                return res.status(500).json({ error: 'Failed to delete bookmark' });
            }
            finally {
                // await prisma.$disconnect(); // Disconnecting is not recommended for serverless functions with connection pooling
            }
        }
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    catch (error) {
        console.error('=== HANDLER ERROR ===', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
