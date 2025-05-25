# Solución para Deployment de quranexpo-web en Vercel

**Fecha:** 2025-05-25  
**Estado:** PLAN DETALLADO - LISTO PARA IMPLEMENTACIÓN  
**Prioridad:** CRÍTICA  

## Problema Identificado

### Error en Vercel
```
Error: No Output Directory named "dist" found after the Build completed.
```

### Causa Raíz (Confirmada en Logs)
```
[11:29:53.576] • Packages in scope: @quran-monorepo/luminous-verses-mobile, @quran-monorepo/quran-data-api, @quran-monorepo/quran-types
```

**❌ `@quran-monorepo/quranexpo-web` NO está en el scope de TurboRepo**
- TurboRepo no incluye `quranexpo-web` en el build
- Como resultado, nunca se ejecuta `astro build`
- Nunca se genera el directorio `dist`
- Vercel falla al no encontrar el output directory

## Solución Principal

### 1. Crear vercel.json en quranexpo-web

**Archivo:** `apps/quranexpo-web/vercel.json`
```json
{
  "buildCommand": "cd ../.. && pnpm run build:web",
  "outputDirectory": "dist",
  "installCommand": "cd ../.. && pnpm install",
  "framework": null,
  "nodeVersion": "18.x"
}
```

**Razón:** 
- Le dice explícitamente a Vercel cómo construir el proyecto
- Fuerza el uso del comando `pnpm run build:web` que incluye el filtro correcto de TurboRepo
- Especifica el output directory correcto

### 2. Configurar Output Directory en Astro

**Archivo:** `apps/quranexpo-web/astro.config.mjs`
```javascript
// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  outDir: './dist',
  integrations: [
    preact({
      include: ['**/*.tsx']
    }),
    tailwind()
  ],
  vite: {
    ssr: {
      noExternal: ['@tanstack/react-virtual']
    }
  }
});
```

**Razón:**
- Asegura que Astro genere el output en `./dist`
- Configura explícitamente el modo estático
- Mantiene compatibilidad con la configuración existente

## Verificación Esperada

Después de implementar los fixes, los logs de Vercel deberían mostrar:

### ✅ TurboRepo Scope Correcto
```
• Packages in scope: @quran-monorepo/luminous-verses-mobile, @quran-monorepo/quran-data-api, @quran-monorepo/quran-types, @quran-monorepo/quranexpo-web
```

### ✅ Build Ejecutado
```
@quran-monorepo/quranexpo-web:build: ✔ Built in XYZ
```

### ✅ Output Directory Encontrado
```
Output Directory "dist" found
```

## Pasos de Implementación

1. **Crear `apps/quranexpo-web/vercel.json`**
2. **Actualizar `apps/quranexpo-web/astro.config.mjs`**
3. **Test local:** `pnpm run build:web`
4. **Commit y push cambios**
5. **Trigger nuevo deployment en Vercel**
6. **Verificar logs para confirmación**

## Riesgo Evaluado

- **Riesgo:** BAJO
- **Rollback:** Fácil - eliminar `vercel.json` si hay problemas
- **Breaking changes:** NINGUNO
- **Tiempo estimado:** 15-20 minutos para implementación completa

## Estado de Implementación

- [ ] Crear vercel.json
- [ ] Actualizar astro.config.mjs
- [ ] Test local exitoso
- [ ] Deployment exitoso en Vercel
- [ ] Actualizar Memory Bank con resultados

---

**Next Action:** Cambiar a modo Code para implementar la solución