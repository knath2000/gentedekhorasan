# Solución Refinada: `vercel.json` con `@vercel/static-build` y Turbo

## Problema Persistente: Deploy Exitoso, Pero Web con Error 404

A pesar de que el `vercel.json` anterior hizo que el deploy "tuviera éxito", la página muestra un 404. Los logs indican un tiempo de construcción de solo 7ms, lo que significa que el comando `astro build` no se ejecutó realmente para `quranexpo-web`. El builder `@vercel/astro` no parece estar manejando correctamente el contexto del subproyecto dentro del monorepo pnpm.

## Solución: Usar `@vercel/static-build` con Comandos Explícitos

Vamos a modificar el `vercel.json` en la raíz del monorepo para usar el builder genérico `@vercel/static-build`. Esto nos da control total sobre los comandos de instalación y construcción, utilizando Turborepo para asegurar que el build específico de `quranexpo-web` se ejecute correctamente.

### Contenido Propuesto para `vercel.json` (en la raíz del proyecto `/Users/kalyannath/quranexpo2/vercel.json`):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/quranexpo-web/package.json", // Identifica el proyecto quranexpo-web
      "use": "@vercel/static-build",
      "config": {
        // `buildCommand` se ejecuta desde la raíz del monorepo.
        // Filtra para construir solo quranexpo-web usando su script 'build'.
        "buildCommand": "pnpm turbo run build --filter=@quran-monorepo/quranexpo-web",
        // `distDir` es relativo a la raíz del monorepo, apuntando al output de quranexpo-web.
        "distDir": "apps/quranexpo-web/dist"
      }
    }
  ]
  // Opcional: Si no está en el Dashboard, puedes definir el comando de instalación global aquí.
  // Si el Root Directory en el Dashboard es '.', Vercel ejecutará el Install Command del Dashboard.
  // "installCommand": "pnpm install" 
}
```

### Explicación de esta Configuración:
-   **`"src": "apps/quranexpo-web/package.json"`**: Sigue siendo la forma de decirle a Vercel que esta entrada de `builds` es para la aplicación `quranexpo-web`.
-   **`"use": "@vercel/static-build"`**: Cambiamos al builder genérico que espera un directorio de salida con archivos estáticos.
-   **`"config": { ... }`**:
    -   **`"buildCommand": "pnpm turbo run build --filter=@quran-monorepo/quranexpo-web"`**:
        -   Este comando se ejecutará desde la raíz del monorepo.
        -   `pnpm turbo run build` invoca el script `build` definido en el `package.json` de los paquetes filtrados.
        -   `--filter=@quran-monorepo/quranexpo-web` asegura que Turborepo solo ejecute el script `build` (que debería ser `astro build`) para el paquete `quranexpo-web`.
    -   **`"distDir": "apps/quranexpo-web/dist"`**:
        -   Esto le dice a Vercel dónde encontrar los archivos estáticos listos para el deploy *después* de que `buildCommand` se haya completado. La ruta es relativa a la raíz del monorepo. Astro, por defecto, construye en un directorio `dist` dentro de su propia carpeta de proyecto.

### Ventajas de este Enfoque:
-   **Control Explícito**: No dependemos de la magia de `@vercel/astro` para entender el monorepo.
-   **Integración con Turborepo**: Aprovecha las capacidades de Turborepo para ejecutar el build correcto.
-   **Claridad**: Es muy claro qué comando se está ejecutando y dónde se espera el resultado.

## Pasos de Implementación:
1.  **Modificar el archivo `vercel.json`** en la raíz del monorepo (`/Users/kalyannath/quranexpo2/vercel.json`) con el nuevo contenido JSON especificado arriba. (Se necesitará Code mode para esto).
2.  **Revisar/Ajustar la Configuración del Proyecto en Vercel Dashboard para `quranexpo-web`**:
    *   **Root Directory**: Debe ser `.` (la raíz del monorepo).
    *   **Framework Preset**: Configurar a `Other`.
    *   **Build Command**: Borrar este campo. El `buildCommand` en `vercel.json` tomará el control.
    *   **Output Directory**: Borrar este campo. El `distDir` en la configuración de `vercel.json` tomará el control.
    *   **Install Command**: Debe ser `pnpm install` (o el comando de instalación que uses para tu monorepo, ejecutado desde la raíz). Vercel ejecutará esto antes de procesar la sección `builds` de `vercel.json`.
3.  **Realizar un nuevo deployment** en Vercel.
4.  **Analizar los logs** para confirmar que:
    *   Se ejecuta `pnpm install` (o similar) desde la raíz.
    *   Se ejecuta el comando `pnpm turbo run build --filter=@quran-monorepo/quranexpo-web`.
    *   El build de Astro para `quranexpo-web` se completa correctamente.
    *   Vercel encuentra los archivos en `apps/quranexpo-web/dist`.
    *   La página ya no muestra un 404.

## Estado
-   🚨 **PROBLEMA CRÍTICO**: El deploy de `quranexpo-web` tiene éxito pero la página resulta en 404. El build de Astro no se está ejecutando correctamente.
-   ✅ **SOLUCIÓN REFINADA PROPUESTA**: Usar `vercel.json` con `@vercel/static-build` y un `buildCommand` explícito que use Turborepo.
-   ⏳ Pendiente de implementación por el usuario.