import fs from 'node:fs';
import path from 'node:path';

// Lista completa de 114 suras del Corán
const surahList = Array.from({ length: 114 }, (_, i) => {
  const number = i + 1;
  let englishName = `Surah ${number}`;
  let name = `سورة ${number}`; // Nombre árabe genérico
  let revelationType: 'Meccan' | 'Medinan' = 'Meccan'; // Tipo de revelación por defecto
  let numberOfAyahs = 10; // Número de aleyas por defecto

  // Nombres y tipos de revelación para las primeras suras conocidas
  if (number === 1) { englishName = "The Opening"; name = "الفاتحة"; numberOfAyahs = 7; }
  else if (number === 2) { englishName = "The Cow"; name = "البقرة"; revelationType = "Medinan"; numberOfAyahs = 286; }
  else if (number === 3) { englishName = "The Family of Imran"; name = "آل عمران"; revelationType = "Medinan"; numberOfAyahs = 200; }
  // ... (se podrían añadir más nombres específicos si se tuvieran)

  return { number, name, englishName, revelationType, numberOfAyahs };
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL_NAME = "google/gemini-2.5-flash-preview-05-20";
const MAX_WORDS = 250;

interface Surah {
  number: number;
  name: string;
  englishName: string;
  revelationType: string;
  numberOfAyahs: number;
}

interface GeneratedDescription {
  surah_id: number;
  description: string;
}

// Función para generar la descripción usando OpenRouter
async function generateDescription(surah: Surah): Promise<string> {
  const prompt = `Generate a comprehensive, detailed, yet succinct description (max ${MAX_WORDS} words) for Surah ${surah.englishName} (${surah.name}) of the Quran, suitable for a modern educational app. Include historical context, main themes, and unique features.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error for Surah ${surah.englishName}: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    // Relanzar el error para que main pueda manejarlo y listar modelos si es un ID inválido
    if (error instanceof Error && error.message.includes("is not a valid model ID")) {
      throw error;
    }
    console.error(`Error generating description for Surah ${surah.englishName}:`, error);
    return `Error: Could not generate description for Surah ${surah.englishName}.`;
  }
}

// Función para listar modelos disponibles en OpenRouter
async function listOpenRouterModels(): Promise<any[]> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error listing models: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.data; // La lista de modelos está en la propiedad 'data'
  } catch (error) {
    console.error("Error al listar modelos de OpenRouter:", error);
    return [];
  }
}


// Función para validar y limpiar la descripción
function validateDescription(text: string): string {
  // Limpiar espacios extra y caracteres especiales básicos
  let cleanedText = text.replace(/\s+/g, ' ').trim();

  // Limitar a MAX_WORDS
  const words = cleanedText.split(' ');
  if (words.length > MAX_WORDS) {
    cleanedText = words.slice(0, MAX_WORDS).join(' ') + '...';
  }

  return cleanedText;
}

// Función para introducir un retraso
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY no está definida. Por favor, configúrela como variable de entorno.");
    process.exit(1);
  }

  const generatedDescriptions: GeneratedDescription[] = [];

  // Intentar generar descripciones
  try {
    // Primera sura para probar el modelo
    const testSurah = surahList[0];
    console.log(`Probando modelo con Surah ${testSurah.englishName} (${testSurah.number})...`);
    await generateDescription(testSurah);
    console.log("Modelo validado.");
  } catch (error: any) {
    if (error.message.includes("is not a valid model ID")) {
      console.error(`El modelo "${MODEL_NAME}" no es válido. Listando modelos disponibles...`);
      const models = await listOpenRouterModels();
      if (models.length > 0) {
        console.log("\n--- Modelos de OpenRouter disponibles ---");
        models.forEach((model: any) => {
          console.log(`ID: ${model.id}, Name: ${model.name || 'N/A'}, Provider: ${model.owned_by || 'N/A'}`);
        });
        console.log("----------------------------------------\n");
        console.log("Por favor, actualice el script con un MODEL_NAME válido de la lista anterior.");
      } else {
        console.log("No se pudieron listar los modelos de OpenRouter. Verifique su clave API.");
      }
      process.exit(1);
    } else {
      console.error("Error inesperado al probar el modelo:", error);
      process.exit(1);
    }
  }

  const outputFilePath = path.join(path.dirname(new URL(import.meta.url).pathname), 'surah_descriptions.json');

  console.log("Iniciando la generación de descripciones de suras...");

  for (const surah of surahList) {
    console.log(`Generando descripción para Surah ${surah.englishName} (${surah.number})...`);
    const rawDescription = await generateDescription(surah);
    const validatedDescription = validateDescription(rawDescription);

    generatedDescriptions.push({
      surah_id: surah.number,
      description: validatedDescription,
    });

    console.log(`Descripción generada para Surah ${surah.englishName}.`);
    await delay(1000); // Retraso de 1 segundo para evitar rate limits
  }

  // Guardar los resultados localmente
  try {
    fs.writeFileSync(outputFilePath, JSON.stringify(generatedDescriptions, null, 2));
    console.log(`Descripciones guardadas en ${outputFilePath}`);
  } catch (error) {
    console.error("Error al guardar las descripciones:", error);
  }

  console.log("Proceso de generación de descripciones completado.");
}

main();