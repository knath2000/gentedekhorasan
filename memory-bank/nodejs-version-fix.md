# Solución Final: Error de Versión de Node.js para quranexpo-web
 
 **Date:** 2025-05-26
 **Estado:** RESUELTO
 **Error:** `Found invalid Node.js Version: "18.x". Please set Node.js Version to 22.x`
 
 ## Análisis del Problema
 
 Vercel estaba detectando Node.js 18.x, pero el proyecto `quranexpo-web` requería la versión 22.x. Esto indicaba que la configuración de la versión de Node.js en Vercel Dashboard no estaba alineada con los requisitos del proyecto.
 
 ## Detalles del Error
 
 ```
 Error: Found invalid Node.js Version: "18.x". Please set Node.js Version to 22.x in your Project Settings to use Node.js 22.
 Learn More: http://vercel.link/node-version
 ```
 
 ## Solución: Actualizar Versión de Node.js en Vercel Dashboard
 
 ### Pasos para la Solución:
 
 1. **Ir a Vercel Dashboard**
 2. **Navegar a Project Settings**
    - Ir al proyecto `quranexpo-web`
    - Clic en la pestaña "Settings"
 3. **Encontrar "General" Settings**
    - Buscar la sección "Node.js Version"
 4. **Cambiar Versión de Node.js**
    - De: `18.x`
    - **A: `22.x`**
 5. **Guardar Configuración**
 6. **Redeploy**
 
 ### Alternativa: Añadir archivo .nvmrc
 
 Crear un archivo en `apps/quranexpo-web/.nvmrc` con el contenido:
 ```
 22
 ```
 Este archivo le indica a Vercel qué versión de Node.js usar automáticamente.
 
 ## Configuración Completa Actualizada
 
 ### Build & Development Settings
 - **Framework Preset:** Astro (o Other)
 - **Root Directory:** `apps/quranexpo-web`
 - **Build Command:** `npm run build` ← (Actualizado a npm como parte de la solución final)
 - **Output Directory:** `dist`
 - **Install Command:** `npm install` ← (Actualizado a npm como parte de la solución final)
 - **Node.js Version:** `22.x` ← FIX CRÍTICO
 
 ### ¿Por qué se requiere Node.js 22.x?
 
 El error sugería que:
 - Las características modernas de pnpm (aunque luego se cambió a npm) o Astro requerían Node.js 22+.
 - Vercel había actualizado sus requisitos de plataforma.
 
 ## Estado
 - ✅ `quran-data-api`: Funcionando (Output Directory = ".")
 - ✅ `quranexpo-web`: Desplegado exitosamente con Node.js 22.x y npm.