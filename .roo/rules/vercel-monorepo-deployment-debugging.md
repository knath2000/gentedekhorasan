---
description: Proporciona un protocolo sistemático para diagnosticar y resolver problemas de despliegue en Vercel para proyectos de monorepo.
author: Roo
version: 1.0
tags: ["vercel", "monorepo", "deployment", "debugging", "protocol"]
globs: ["vercel.json", "package.json", "tsconfig.json", "turbo.json", "apps/**/vercel.json", "apps/**/package.json", "apps/**/tsconfig.json"]
---

# Protocolo de Depuración de Despliegues en Vercel para Monorepos

## Objetivo

Este protocolo proporciona un proceso sistemático para diagnosticar y resolver problemas de despliegue en Vercel para proyectos de monorepo, basándose en aprendizajes clave de interacciones previas.

## Factores Clave a Verificar

Antes de iniciar la depuración, asegúrate de revisar los siguientes puntos:

### 1. Configuración de Vercel Dashboard

*   **`Root Directory` y `Framework Preset`:**
    *   Asegúrate de que el `Root Directory` en la configuración del proyecto de Vercel apunte directamente al subproyecto que intentas desplegar (ej. `apps/quranexpo-web`).
    *   Verifica que el `Framework Preset` sea el correcto para tu proyecto (ej. `Astro`, `Next.js`).
*   **`Node.js Version`:**
    *   Confirma que la versión de Node.js configurada en Vercel Dashboard (`Project Settings -> General -> Node.js Version`) coincida con los requisitos de tu proyecto y las dependencias.
*   **`Install Command` y `Build Command`:**
    *   Revisa los comandos de instalación y construcción. Si usas `pnpm` y experimentas problemas de compatibilidad (ej. `ERR_INVALID_THIS` con Node.js 22.x y pnpm 6.x), considera cambiar el `Install Command` a `npm install` y el `Build Command` a `npm run build` (o el comando de build específico de tu subproyecto).

### 2. Archivos de Configuración del Proyecto

*   **`vercel.json` (Raíz y Subproyectos):**
    *   **Ubicación:** Para monorepos, la configuración de `functions` y `routes` debe estar en el `vercel.json` de la **raíz del monorepo**.
    *   **Rutas:** Asegúrate de que las rutas en `vercel.json` apunten a los archivos JavaScript compilados en el directorio `dist` dentro del subdirectorio de la aplicación (ej. `"apps/quran-data-api/dist/api/v1/get-metadata.js"`).
    *   **Subproyectos:** El `vercel.json` anidado en el subdirectorio de la API (ej. `apps/quran-data-api/vercel.json`) debe ser mínimo (solo `{"version": 2}`).
*   **`package.json`:**
    *   **Scripts de Build:** Verifica que el script `build` de tu aplicación de API ejecute la compilación de TypeScript (ej. `tsc -p api/tsconfig.json`).
    *   **`postinstall` hook:** Asegúrate de que `prisma generate` se ejecute en el `postinstall` hook para generar el cliente de Prisma después de la instalación de dependencias.
    *   **Dependencias de Prisma:** Confirma que `prisma` y `@prisma/client` estén en `dependencies` (no `devDependencies`) para entornos de producción.
*   **`tsconfig.json`:**
    *   **Compilación:** Asegúrate de que `tsconfig.json` esté configurado para compilar TypeScript a JavaScript en un directorio `dist` (`"outDir": "dist"`) y permitir la emisión (`"noEmit": false`).
    *   **`paths`:** Considera añadir `paths` explícitos para los tipos generados por Prisma (ej. `"../generated/prisma": ["./generated/prisma"]`) para mejorar la resolución de tipos en monorepos.
*   **`turbo.json`:**
    *   **Sintaxis:** Para versiones recientes de Turborepo (2.0+), el campo para definir las configuraciones de las tareas de build debe ser `"tasks"`, no `"pipeline"`.

### 3. Variables de Entorno

*   **Configuración en Vercel Dashboard:** Es crucial configurar todas las variables de entorno necesarias (ej. `DATABASE_URL`, `PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `LIBSQL_URL`, `LIBSQL_AUTH_TOKEN`) directamente en el panel de control de Vercel. Las `.env.local` solo funcionan localmente.

## Pasos de Depuración Sistemática

1.  **Revisar Logs de Despliegue:**
    *   Accede a los logs de despliegue en el Dashboard de Vercel.
    *   Busca errores específicos, advertencias o mensajes que indiquen la causa del fallo (ej. errores de compilación, problemas de instalación de dependencias, errores de tiempo de ejecución).
2.  **Aislar el Problema:**
    *   Determina si el problema es del frontend o de la API.
    *   Identifica si el fallo ocurre durante la fase de `build` o en `runtime`.
3.  **Forzar Redeploys Limpios:**
    *   Si sospechas de problemas de caché, intenta un redeploy forzando la reconstrucción de la caché en Vercel.
4.  **Probar Soluciones Alternativas:**
    *   Si un gestor de paquetes (ej. `pnpm`) está causando problemas, intenta cambiar a `npm` para los comandos de instalación y build en Vercel.
    *   Si hay problemas con Prisma, considera usar el cliente de la base de datos directamente para modelos específicos si es posible.
5.  **Verificación Local:**
    *   Asegúrate de que el proyecto se construya y ejecute correctamente en tu entorno local antes de intentar un nuevo despliegue.
6.  **Consultar Documentación y Comunidad:**
    *   Si el problema persiste, consulta la documentación oficial de Vercel, Prisma, Astro, o las comunidades relevantes para buscar soluciones a problemas conocidos.