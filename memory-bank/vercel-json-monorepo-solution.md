# Solución Definitiva: `vercel.json` en la Raíz del Monorepo

## Análisis del Problema Persistente
A pesar de las configuraciones en el Dashboard de Vercel y el `.vercelignore` local, Vercel sigue:
1.  Detectando TurboRepo desde la raíz del monorepo.
2.  Ejecutando el script `build` del `package.json` raíz (`turbo build`).
3.  Construyendo otros proyectos (`quran-data-api`, `luminous-verses-expo`) durante el deploy de `quranexpo-web`.

Esto sucede porque la configuración del proyecto en el Dashboard de Vercel (especialmente el `Root Directory` y los comandos de build/install) puede ser anulada o interactuar de forma inesperada con la detección automática de monorepos por parte de Vercel, especialmente si encuentra un `turbo.json` en la raíz.

## Solución: `vercel.json` en la Raíz del Monorepo
La forma más robusta y explícita de controlar los builds en un monorepo en Vercel es usar un archivo `vercel.json` en la **raíz del monorepo**. Este archivo tomará precedencia sobre muchas configuraciones del Dashboard y la auto-detección.

### Contenido Propuesto para `vercel.json` (en la raíz del proyecto):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/quranexpo-web/package.json",
      "use": "@vercel/astro"
    }
  ]
}
```

### Explicación:
-   **`"version": 2`**: Especifica la versión de la configuración de Vercel.
-   **`"builds": []`**: Un array que define cómo se deben construir diferentes partes del proyecto.
-   **`"src": "apps/quranexpo-web/package.json"`**: Le dice a Vercel que este build se aplica al paquete/aplicación cuyo `package.json` se encuentra en `apps/quranexpo-web/`. Esto es crucial para aislar el build a solo este proyecto.
-   **`"use": "@vercel/astro"`**: Especifica que se debe usar el builder oficial de Vercel para Astro. Esto asegura que se use el proceso de build correcto para `quranexpo-web` y que se manejen correctamente sus outputs.

### Impacto de esta Solución:
-   Al definir un build específico para `apps/quranexpo-web/package.json`, Vercel se enfocará solo en ese proyecto cuando se trate de la aplicación `quranexpo-web`.
-   Ya no debería intentar ejecutar el `turbo build` del `package.json` raíz para este proyecto específico.
-   Debería ignorar los otros paquetes del monorepo (como `quran-data-api` y `luminous-verses-expo`) para el deploy de `quranexpo-web`.

## Pasos de Implementación:
1.  **Crear el archivo `vercel.json`** en la raíz del monorepo (`/Users/kalyannath/quranexpo2/vercel.json`) con el contenido especificado. (Se necesitará Code mode para esto).
2.  **Revisar la Configuración del Proyecto en Vercel Dashboard para `quranexpo-web`**:
    *   **Root Directory**: Debería ser `.` (la raíz del monorepo), ya que `vercel.json` ahora maneja la lógica de qué construir.
    *   **Build Command**: Puede que necesite ser borrado o ajustado. El builder `@vercel/astro` debería manejar esto.
    *   **Output Directory**: `@vercel/astro` lo configurará automáticamente.
    *   **Install Command**: Puede permanecer como `pnpm install` (ejecutado desde la raíz si el Root Directory es `.`) o ajustarse.
    *   **Framework Preset**: Cambiar a `Other` o dejar que Vercel lo detecte automáticamente basado en `vercel.json`.
    *   **Es posible que se necesite eliminar la configuración de "Ignored Build Step" si se había configurado previamente, ya que `vercel.json` ofrece un control más granular.**

3.  **Realizar un nuevo deployment** en Vercel.
4.  **Analizar los logs** para confirmar que:
    *   Solo se construye `quranexpo-web`.
    *   Se usa el builder de Astro.
    *   No hay `turbo build` del scope global.

## Estado
-   ⚠️ Problema de Vercel detectando y ejecutando `turbo build` desde la raíz del monorepo persiste a pesar de intentos previos.
-   ✅ Nueva solución propuesta: Usar `vercel.json` en la raíz del monorepo para un control explícito del build.
-   ⏳ Pendiente de implementación por el usuario (Architect mode no puede crear `vercel.json`).