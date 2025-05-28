# Solución: Conflicto de Archivos Prisma en quran-data-api

## Problema Identificado
Vercel falla con error de conflicto de rutas/nombres de archivos:
```
Error: Two or more files have conflicting paths or names. Please make sure path segments and filenames, without their extension, are unique. The path "api/generated/prisma/query_engine_bg.js" has conflicts with "api/generated/prisma/query_engine_bg.wasm".
```

## Análisis del Problema
- Prisma genera archivos con el mismo nombre base pero diferentes extensiones
- `query_engine_bg.js` y `query_engine_bg.wasm` causan conflicto en Vercel
- Vercel trata estos archivos como conflictos de naming cuando se despliegan

## Soluciones Propuestas

### Solución 1: Excluir archivos WASM en .vercelignore
Crear `.vercelignore` en `apps/quran-data-api/`:
```
api/generated/prisma/*.wasm
api/generated/prisma/libquery_engine-*.node
```

### Solución 2: Configurar Prisma para Edge Runtime
Modificar `prisma/schema.prisma` para usar solo edge runtime:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../api/generated/prisma"
  engineType = "library"
}
```

### Solución 3: Mover archivos generados fuera de api/
Cambiar output path en schema.prisma:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}
```

### Solución 4: Usar Data Proxy (Recomendada)
Configurar Prisma con Data Proxy para evitar archivos engine:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../api/generated/prisma"
  previewFeatures = ["dataProxy"]
}
```

## Recomendación
Implementar Solución 1 (.vercelignore) como fix rápido, ya que:
- No requiere cambios en código
- Mantiene funcionalidad actual
- Los archivos WASM no son necesarios en el runtime de Vercel
- Prisma puede funcionar solo con archivos JS en edge environment

## Archivo .vercelignore requerido
Crear archivo `apps/quran-data-api/.vercelignore` con contenido:
```
# Ignore Prisma WASM and native binaries that conflict with Vercel deployment
api/generated/prisma/*.wasm
api/generated/prisma/libquery_engine-*.node
api/generated/prisma/*.dylib.node
api/generated/prisma/*.so.node
```

## Estado
- ✅ Problema diagnosticado
- ✅ Implementación de .vercelignore completada
- ⏳ Prueba de deployment pendiente