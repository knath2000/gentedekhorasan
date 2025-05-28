# Plan de Corrección: Reintroducir `"src"` en `vercel.json` para Evitar Error de Auto-Detección

## Problema Actual:
El deploy en Vercel falla con el error: `Error: Build "src" is ".expo/README.md" but expected "package.json" or "build.sh"`.
Esto sucedió después de que eliminamos la propiedad `"src"` de la definición del build en `vercel.json`.

## Diagnóstico:
Sin un `"src"` explícito en la entrada de `builds` para `quranexpo-web`, Vercel intenta auto-detectar proyectos dentro del monorepo. En este proceso, ha identificado erróneamente `.expo/README.md` (probablemente del proyecto `luminous-verses-expo`) como un origen de build, lo cual es incorrecto.

## Solución Propuesta:
Reintroducir la propiedad `"src"` en la entrada de `builds` dentro de `vercel.json`, apuntando directamente al `package.json` de la aplicación `quranexpo-web`. Esto proporcionará a Vercel la especificidad necesaria.

### Contenido Propuesto para `vercel.json` (en la raíz `/Users/kalyannath/quranexpo2/vercel.json`):
```json
{
  "version": 2,
  "installCommand": "pnpm install --frozen-lockfile",
  "builds": [
    {
      "src": "apps/quranexpo-web/package.json", // <-- "src" reintroducido aquí
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "pnpm --filter @quran-monorepo/quranexpo-web run build",
        "distDir": "apps/quranexpo-web/dist"
      }
    }
  ],
  "rewrites": [
    // Reescribe todas las rutas para que sirvan desde el output de Astro
    { "source": "/(.*)", "destination": "/apps/quranexpo-web/dist/$1" }
  ]
}
```

### Explicación del Cambio:
-   **`"src": "apps/quranexpo-web/package.json"`**: Al especificar esto, le decimos a Vercel que esta definición de build se aplica *exclusivamente* al paquete Astro definido por este `package.json`. Esto debería evitar que Vercel intente construir otros artefactos o directorios del monorepo (como `.expo/README.md`) bajo esta regla de build.

### Configuración del Vercel Dashboard (Importante):
Debe permanecer como se discutió previamente:
-   **Root Directory**: Dejar **VACÍO**.
-   **Framework Preset**: `Other`.
-   **Build Command**: **BORRAR/DEJAR VACÍO**.
-   **Output Directory**: **BORRAR/DEJAR VACÍO**.
-   **Install Command**: **BORRAR/DEJAR VACÍO** (controlado por `vercel.json`).
-   **"Ignored Build Step"**: `Automatic`.

## Pasos de Implementación:
1.  **Modificar el archivo `vercel.json`** en la raíz del monorepo con el nuevo contenido. (Se necesitará Code mode).
2.  **Asegurar que la Configuración del Proyecto en Vercel Dashboard esté "limpia"** de overrides de build, como se detalló arriba.
3.  **Realizar un nuevo deployment** en Vercel.
4.  **Analizar los logs de Vercel**. Esperamos que el error `.expo/README.md` desaparezca y que el build de `quranexpo-web` proceda (y, con suerte, tarde más de 8ms).

## Estado:
-   🔴 **NUEVO ERROR DE BUILD:** `Error: Build "src" is ".expo/README.md" but expected "package.json" or "build.sh"`.
-   🟡 Hipótesis: La ausencia de `"src"` en `vercel.json` causó una auto-detección incorrecta en el monorepo.
-   ⏳ Proponiendo reintroducir `"src": "apps/quranexpo-web/package.json"` en la configuración de `builds` de `vercel.json`.