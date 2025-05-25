# Solución: Problema de Output Directory en quranexpo-web

## Problema Identificado
Vercel no puede encontrar el output directory después del build, a pesar de configurar:
- Framework: 'Other'
- Build Command: 'pnpm run build'
- Output Directory: '.'
- Root Directory: 'apps/quranexpo-web'

## Análisis del Problema

### Configuración Astro Actual
En `apps/quranexpo-web/astro.config.mjs`:
```javascript
export default defineConfig({
  output: 'static',
  outDir: './dist',  // ← Astro genera en './dist'
  // ...
});
```

### Problema de Discrepancia
- **Astro genera en:** `./dist` (dentro de apps/quranexpo-web)
- **Vercel busca en:** `.` (raíz de apps/quranexpo-web)
- **Resultado:** Vercel no encuentra los archivos generados

## Solución Recomendada

### Opción 1: Cambiar Output Directory en Vercel (Recomendada)
**Configuración Vercel Dashboard:**
- Framework: 'Other'
- Build Command: 'pnpm run build'
- **Output Directory: 'dist'** ← CAMBIAR de '.' a 'dist'
- Install Command: 'pnpm install'
- Root Directory: 'apps/quranexpo-web'

### Opción 2: Cambiar outDir en Astro Config
Modificar `apps/quranexpo-web/astro.config.mjs`:
```javascript
export default defineConfig({
  output: 'static',
  outDir: './',  // ← Cambiar de './dist' a './'
  // ...
});
```

### Opción 3: Usar Build Script Personalizado
Crear script que mueva archivos después del build:
```json
// apps/quranexpo-web/package.json
{
  "scripts": {
    "build": "astro build && cp -r dist/* ."
  }
}
```

## Recomendación
**Usar Opción 1** porque:
- Es la configuración más estándar para proyectos Astro
- No requiere cambios en código
- Mantiene la estructura de archivos limpia
- Coincide con las mejores prácticas de Astro

## Estado
- ✅ Problema diagnosticado
- ✅ Solución identificada
- ⏳ Pendiente cambio en Vercel Dashboard