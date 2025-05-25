# Implementación Etapa 1: Fixes Críticos

**Fecha:** 2025-05-25
**Estado:** Lista para implementación
**Modo requerido:** Code

## Pasos de Implementación Inmediata

### 1. Corrección de apps/luminous-verses-expo/package.json

**Problema:** 
- Nombre de paquete inconsistente: `quranexpo2` 
- Scripts de Next.js sin dependencias instaladas
- Configuración mixta Expo/Next.js

**Cambios necesarios:**
```json
{
  "name": "@quran-monorepo/luminous-verses-mobile",
  "scripts": {
    "dev": "expo start",
    "build": "expo build",
    "build:mobile": "expo build",
    "lint": "turbo lint",
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios"
  }
}
```

**Eliminar scripts problemáticos:**
- `"dev": "next dev"`
- `"build": "next build"`
- `"start": "next start"`

### 2. Actualización de turbo.json (Root)

**Agregar configuración específica para mobile:**
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "build:web": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "build:api": {
      "dependsOn": ["^build"],  
      "outputs": ["dist/**"]
    },
    "build:mobile": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### 3. Exclusión del Mobile del Build Global

**Objetivo:** Prevenir que Vercel trate de hacer build del proyecto móvil

**Método:** Configurar filtros en turbo.json para que el comando `build` por defecto excluya proyectos móviles

### 4. Verificación de quranexpo-web/package.json

**Confirmar configuración correcta de Astro:**
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "build:web": "astro build",
    "preview": "astro preview"
  }
}
```

### 5. Testing Local

**Comandos a ejecutar:**
```bash
# Test build individual de cada proyecto
pnpm run build:api
pnpm run build:web  
pnpm run build:mobile # Solo para verificar que no falla

# Test build global (debe excluir mobile)
pnpm run build
```

## Resultados Esperados

1. ✅ `luminous-verses-expo` ya no causa errores de `next: command not found`
2. ✅ `quranexpo-web` puede hacer build exitosamente
3. ✅ `quran-data-api` sigue funcionando correctamente
4. ✅ Turbo build global funciona sin fallos
5. ✅ Preparado para deployment de `quranexpo-web` en Vercel

## Archivos a Modificar

1. `apps/luminous-verses-expo/package.json` - Corrección de scripts y nombre
2. `turbo.json` - Agregar tasks específicos
3. `package.json` (root) - Agregar scripts específicos por proyecto

## Validación Post-Implementación

1. Ejecutar `pnpm install` para verificar workspaces
2. Ejecutar `pnpm run build:web` para test de quranexpo-web
3. Ejecutar `pnpm run build` para test del monorepo
4. Verificar que no hay errores de dependencias faltantes

## Próximo Paso

Una vez completados estos fixes, proceder con configuración de Vercel para deployment de `quranexpo-web`.