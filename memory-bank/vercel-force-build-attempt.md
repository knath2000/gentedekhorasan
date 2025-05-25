# Intento de Solución: Forzar Build en Vercel con `--force`

## Contexto:
El build local de `quranexpo-web` usando `pnpm turbo run build --filter=@quran-monorepo/quranexpo-web` funciona correctamente y genera el output esperado en `apps/quranexpo-web/dist/`.
Esto sugiere que el problema de los "8ms build" y el 404 en Vercel no se debe a un error fundamental en el comando de build o en la configuración de Astro.

La sospecha principal es que Vercel no está ejecutando correctamente el `buildCommand` especificado en `vercel.json`, o que el caché de Turborepo en el entorno de Vercel está causando que el build se omita (similar al "cache hit" visto localmente, pero con un resultado incorrecto en Vercel).

## Solución Propuesta: Modificar `vercel.json` para Incluir `--force`

Para descartar el caché de Turborepo como el culpable en el entorno de Vercel, añadiremos la flag `--force` al `buildCommand`.

### Contenido Propuesto para `vercel.json` (en la raíz del proyecto `/Users/kalyannath/quranexpo2/vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/quranexpo-web/package.json",
      "use": "@vercel/static-build",
      "config": {
        // Añadido --force al final del comando de build
        "buildCommand": "pnpm turbo run build --filter=@quran-monorepo/quranexpo-web --force",
        "distDir": "apps/quranexpo-web/dist"
      }
    }
  ]
}
```

### Explicación del Cambio:
-   **`--force`**: Esta flag le dice a Turborepo que ignore cualquier caché existente y ejecute la tarea de build desde cero. Si el problema en Vercel era un "falso positivo" del caché, esto debería asegurar que `astro build` se ejecute.

## Pasos de Implementación:
1.  **Modificar el archivo `vercel.json`** en la raíz del monorepo con el nuevo contenido JSON especificado arriba. (Se necesitará Code mode).
2.  **Mantener la Configuración del Proyecto en Vercel Dashboard para `quranexpo-web` como estaba (Root Directory vacío, etc.)**.
3.  **Realizar un nuevo deployment** en Vercel.
4.  **Analizar los logs de Vercel** para confirmar que:
    *   El tiempo de build es significativamente mayor a 8ms.
    *   Hay logs que indiquen que `astro build` se está ejecutando.
    *   Vercel encuentra los archivos en `apps/quranexpo-web/dist`.
    *   La página ya no muestra un 404.

## Si Esto No Funciona:
Si el problema persiste, los siguientes pasos serían:
1.  Revisar si el error de Vercel Edge Config que aparece localmente (`No connection string provided`) está ocurriendo también en el entorno de build de Vercel y deteniendo prematuramente el proceso de alguna manera (aunque es menos probable que cause un build de 8ms).
2.  Considerar la "Opción 2" del plan original: `pnpm --filter @quran-monorepo/quranexpo-web run build` para ver si invocar pnpm directamente sin la capa de `turbo run` cambia el comportamiento en Vercel.
3.  Verificar los logs de Vercel con máximo detalle para cualquier pista sobre por qué `buildCommand` no produce output.

## Estado:
- ✅ Build local de `quranexpo-web` confirmado como exitoso.
- 🟡 Sospecha: Problema en Vercel con ejecución de `buildCommand` o caché de Turborepo.
- ⏳ Proponiendo modificación a `vercel.json` para añadir `--force`.