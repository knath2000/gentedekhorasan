# Plan de Corrección para Error de Despliegue en Vercel

## Problema Identificado

El error `Property 'startIndex' is missing` persiste en Vercel a pesar de que:
- Prisma se genera correctamente: `✔ Generated Prisma Client (v6.8.2) to ./api/generated/prisma`
- El modelo `QuranSurah` incluye `startIndex` en `schema.prisma`
- Las correcciones previas (orden de build, postinstall, paths) fueron implementadas

## Causa Raíz

Según la investigación de Perplexity, el problema es la **ruta no estándar** del output de Prisma (`../api/generated/prisma`). Esta ruta puede causar problemas de resolución en entornos de despliegue como Vercel.

## Solución Propuesta

### 1. Cambiar Output de Prisma a Ruta Estándar

**Archivo:** `apps/quran-data-api/prisma/schema.prisma`

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
  output          = "./generated/client"  // Cambiar de "../api/generated/prisma"
  binaryTargets   = ["native", "rhel-openssl-3.0.x", "darwin-arm64"]
}
```

### 2. Actualizar Imports en el Código

**Archivo:** `apps/quran-data-api/api/lib/prisma.ts`

```typescript
// Cambiar import de:
import { PrismaClient } from '../generated/prisma';
// A:
import { PrismaClient } from '../../generated/client';
```

**Archivo:** `apps/quran-data-api/api/v1/get-metadata.ts`

```typescript
// Cambiar import de:
import { QuranSurah } from '../generated/prisma';
// A:
import { QuranSurah } from '../../generated/client';
```

### 3. Actualizar Configuración de TypeScript

**Archivo:** `apps/quran-data-api/api/tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "../../generated/client": ["../generated/client"]
    }
  }
}
```

### 4. Limpiar y Regenerar

```bash
# Eliminar directorio anterior
rm -rf apps/quran-data-api/api/generated

# Regenerar con nueva configuración
cd apps/quran-data-api
pnpm prisma generate

# Instalar dependencias
pnpm install
```

### 5. Verificar Funcionamiento Local

```bash
# Compilar TypeScript localmente
cd apps/quran-data-api
pnpm run build:functions
```

### 6. Desplegar en Vercel

Después de confirmar que funciona localmente, hacer push y desplegar en Vercel.

## Justificación Técnica

1. **Rutas Estándar:** `./generated/client` es la convención estándar de Prisma
2. **Resolución de Tipos:** Evita problemas de resolución en diferentes entornos
3. **Compatibilidad:** Mejor compatibilidad con herramientas de build como Vercel
4. **Mantenibilidad:** Sigue las mejores prácticas de la comunidad

## Orden de Implementación

1. ✅ Documentar plan (este archivo)
2. ✅ Cambiar a modo Code
3. ✅ Implementar cambios en schema.prisma
4. ✅ Actualizar imports en archivos TypeScript
5. ✅ Actualizar tsconfig.json
6. ❌ Limpiar y regenerar cliente Prisma - **PROBLEMA IDENTIFICADO**
7. ❌ Verificar build local - **FALLA CON `Cannot find module`**
8. ⏸️ Desplegar en Vercel - **PENDIENTE**

## Estado Actual (27/05/2025 10:26)

### Problema Crítico Identificado

**DUPLICACIÓN DE CLIENTE PRISMA:** El cliente se genera en ambas ubicaciones:
- ❌ `apps/quran-data-api/api/generated/prisma/` (ubicación antigua)
- ✅ `apps/quran-data-api/prisma/generated/client/` (ubicación nueva)

### Error Actual en Build Local
```
api/lib/prisma.ts:2:30 - error TS2307: Cannot find module '../prisma/generated/client'
api/v1/get-metadata.ts:3:28 - error TS2307: Cannot find module '../prisma/generated/client'
```

### Solución Requerida (Modo Code)

**PASO CRÍTICO:** Limpiar completamente la duplicación

```bash
# 1. Eliminar ubicación antigua completamente
rm -rf apps/quran-data-api/api/generated

# 2. Verificar schema.prisma (debe tener output = "./generated/client")

# 3. Regenerar SOLO en nueva ubicación
cd apps/quran-data-api
pnpm prisma generate --schema=./prisma/schema.prisma

# 4. Verificar que SOLO existe la nueva ubicación
ls -la prisma/generated/client/

# 5. Verificar build local
pnpm run build:functions
```

## Próximos Pasos

**REQUERIDO:** Cambiar al modo Code para:
1. Eliminar duplicación de cliente Prisma
2. Regenerar cliente en ubicación única
3. Verificar resolución de módulos TypeScript
4. Confirmar build local exitoso antes de Vercel