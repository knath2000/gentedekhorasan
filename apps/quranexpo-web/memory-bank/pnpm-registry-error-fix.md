# Solución Final: Problema de Registro de pnpm (ERR_INVALID_THIS)
 
 **Date:** 2025-05-26
 **Estado:** RESUELTO
 **Error:** `ERR_PNPM_META_FETCH_FAIL GET https://registry.npmjs.org/... Value of "this" must be of type URLSearchParams`
 
 ## Análisis del Problema
 
 Los logs mostraron múltiples problemas durante la instalación de dependencias con pnpm:
 
 1. **Advertencia de Engine:** `Unsupported engine: wanted: {"node":">=20.0.0 <21.0.0"} (current: {"node":"v22.15.1","pnpm":"6.35.1"})`
 2. **Conflicto de Versión de pnpm:** Vercel estaba usando pnpm 6.35.1 con Node.js 22.15.1.
 3. **Errores de Registro:** `ERR_INVALID_THIS` al intentar acceder al registro npm.
 4. **Alcance del Monorepo:** A pesar de la configuración de `Root Directory`, Vercel seguía ejecutando la instalación para "all 4 workspace projects".
 
 ## Causas Raíz
 
 1. **Versión de pnpm Incompatible:** pnpm 6.35.1 no es compatible con Node.js 22.x, lo que causaba los errores de registro.
 2. **Desajuste de Versión de Node.js:** El `package.json` raíz especificaba un rango de Node.js (`>=20.0.0 <21.0.0`) que entraba en conflicto con la versión 22.x utilizada.
 3. **Ejecución desde la Raíz:** Vercel seguía detectando el workspace completo, lo que exacerbaba los problemas de compatibilidad.
 
 ## Solución Final: Usar npm en lugar de pnpm
 
 La solución más efectiva y estable fue cambiar el gestor de paquetes de `pnpm` a `npm` para el proyecto `quranexpo-web` en Vercel.
 
 ### Configuración Final para quranexpo-web en Vercel Dashboard:
 
 - **Framework Preset:** Astro (o Other)
 - **Root Directory:** `apps/quranexpo-web`
 - **Build Command:** `npm run build` ← CAMBIO: Usar npm
 - **Output Directory:** `dist`
 - **Install Command:** `npm install` ← CAMBIO: Usar npm
 - **Node.js Version:** `22.x`
 
 ### ¿Por qué npm funciona mejor en este escenario?
 
 1. **Mejor Compatibilidad con Node.js 22:** `npm` demostró ser más estable con la versión 22.x de Node.js, evitando los errores de registro que presentaba `pnpm`.
 2. **Evita Restricciones de Engines:** `npm` maneja mejor las incompatibilidades de versión de Node.js definidas en el `package.json` raíz.
 3. **Sin Detección de Workspace:** `npm` no intenta procesar el monorepo completo, lo que simplifica la instalación de dependencias para el proyecto aislado.
 4. **Resolución de Dependencias Simplificada:** Para builds de directorios aislados, `npm` ofrece una resolución de dependencias más directa.
 
 ## Estado
 - ✅ **Problema Resuelto:** El despliegue de `quranexpo-web` ahora es exitoso.
 - ✅ **Causa Raíz Confirmada:** Incompatibilidad de pnpm/Node.js y restricciones de `engines`.
 - ✅ **Solución Implementada:** Cambio a `npm` para `quranexpo-web`.