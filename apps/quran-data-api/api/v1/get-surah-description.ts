import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma'; // Import the shared Prisma client

export default async (request: VercelRequest, response: VercelResponse) => {
  // Añadir encabezados CORS para permitir solicitudes desde cualquier origen
  response.setHeader('Access-Control-Allow-Origin', '*'); // Permitir cualquier origen
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar solicitudes OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    const { surahId } = request.query;

    if (!surahId) {
      return response.status(400).json({ error: 'surahId is required' });
    }

    const surahDescription = await prisma.surahDescription.findUnique({
      where: {
        surah_id: Number(surahId),
      },
      select: {
        description: true,
      },
    });

    if (surahDescription) {
      response.status(200).json({ description: surahDescription.description });
    } else {
      response.status(404).json({ error: 'Description not found for this surahId' });
    }
  } catch (error) {
    console.error('Error fetching surah description:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};