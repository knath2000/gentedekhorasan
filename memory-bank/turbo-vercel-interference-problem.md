# Problema: Vercel Detecta TurboRepo y Ejecuta Build Incorrecto

## Problema Identificado
Del log de Vercel queda claro que:
1. **Vercel detecta automáticamente TurboRepo:** `> Detected Turbo. Adjusting default settings...`
2. **Ignora la configuración de `quranexpo-web`** y ejecuta `turbo build` desde la raíz
3. **Ejecuta build de todos los packages del workspace** en lugar de solo `quranexpo-web`
4. **Ejecuta el build genérico `build`** en lugar del específico para web

## Evidencia del Log
```
[14:14:25.745] > quran-monorepo@1.0.0 build /vercel/path0
[14:14:25.746] > turbo build

[14:14:25.967] • Packages in scope: @quran-monorepo/luminous-verses-mobile, @quran-monorepo/quran-data-api, @quran-monorepo/quran-types
[14:14:25.967] • Running build in 3 packages
```

**Nota crítica:** `@quran-monorepo/quranexpo-web` NO aparece en el scope porque no está en la configuración de turbo.

## Análisis de `turbo.json`
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "build:web": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

## Problemas Identificados

### 1. Package Name Missing en Turbo Scope
- `quranexpo-web` no tiene package name correcto en `package.json`
- Turbo no lo detecta como parte del workspace

### 2. Vercel Override de Configuración
- Vercel auto-detecta TurboRepo y ignora configuración manual
- Ejecuta `turbo build` global en lugar de comandos específicos

### 3. Task Mismatch
- Turbo ejecuta task `build` genérico
- `quranexpo-web` necesita task específico `build:web`

## Soluciones Propuestas

### Opción 1: Deshabilitar Auto-detección de Turbo en Vercel (RECOMENDADA)
**Crear `.vercelignore` en `apps/quranexpo-web/`:**
```
# Prevent Vercel from auto-detecting TurboRepo
turbo.json
```

**Configuración Vercel Dashboard:**
- Framework: 'Astro'
- Build Command: `pnpm run build`
- Output Directory: `dist`
- Root Directory: `apps/quranexpo-web`

### Opción 2: Corregir Package Name en quranexpo-web
**Verificar `apps/quranexpo-web/package.json`:**
```json
{
  "name": "@quran-monorepo/quranexpo-web",
  // ...
}
```

### Opción 3: Usar Build Command Específico de Turbo
**Configuración Vercel Dashboard:**
- Framework: 'Other'
- Build Command: `npx turbo run build:web --filter=@quran-monorepo/quranexpo-web`
- Output Directory: `dist`
- Root Directory: `.` (raíz del monorepo)

## Recomendación
**Usar Opción 1** porque:
- Es la más simple y directa
- Evita la complejidad de TurboRepo en deployment
- Permite que `quranexpo-web` se comporte como proyecto independiente
- Coincide con el approach exitoso de `quran-data-api`

## Estado
- ✅ Problema diagnosticado
- ✅ Causa raíz identificada: Vercel auto-detecta TurboRepo
- ⏳ Pendiente implementación de solución