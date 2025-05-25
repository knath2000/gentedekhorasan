# Intento de Solución: `vercel.json` con `pnpm --filter` Directo

## Problema Persistente:
El build de `quranexpo-web` en Vercel sigue completándose en ~8ms, resultando en un 404. El `buildCommand` en `vercel.json` (incluso con `--force`) no parece ejecutarse. Adicionalmente, el usuario reporta un mensaje persistente en Vercel sobre "current production deployment settings differ from the project settings".

## Hipótesis:
1.  La configuración "Ignored Build Step" en Vercel podría estar activa.
2.  La forma en que `pnpm turbo run build --filter` es invocado o interpretado dentro del entorno de build de Vercel no está funcionando.
3.  Hay un conflicto de configuración más profundo en Vercel que no se resuelve solo con `vercel.json`.

## Plan de Acción:

### Paso 1: Verificar "Ignored Build Step" (Acción Usuario)
   El usuario debe verificar en el Dashboard de Vercel (Settings -> General -> Build & Development Settings) que "Ignored Build Step" esté **DESACTIVADO**.

### Paso 2: Modificar `vercel.json` (Si el Paso 1 no resuelve)
   Se propone cambiar el `buildCommand` para usar `pnpm --filter <package> run <script>` directamente, eliminando la capa de `turbo run` para este build específico en Vercel.

### Contenido Propuesto para `vercel.json` (en la raíz `/Users/kalyannath/quranexpo2/vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/quranexpo-web/package.json",
      "use": "@vercel/static-build",
      "config": {
        // Cambiado para usar pnpm --filter directamente
        "buildCommand": "pnpm --filter @quran-monorepo/quranexpo-web run build",
        "distDir": "apps/quranexpo-web/dist"
      }
    }
  ]
}
```

### Explicación del Cambio:
-   **`"buildCommand": "pnpm --filter @quran-monorepo/quranexpo-web run build"`**:
    -   Este comando le dice a `pnpm` que encuentre el workspace llamado `@quran-monorepo/quranexpo-web` y ejecute el script llamado `build` definido en su `package.json`.
    -   Esto es más directo que `pnpm turbo run build --filter=...` y podría evitar problemas de interpretación o de caché específicos de cómo `turbo run` se comporta en el entorno de Vercel.
    -   La flag `--force` se omite aquí temporalmente para ver si el problema es con `turbo run` en sí. Si esto funciona, se podría reintroducir si se sospecha de problemas de caché con `pnpm` directamente (aunque es menos común para builds simples).

### Pasos de Implementación (Después de Verificar Paso 1):
1.  **Modificar el archivo `vercel.json`** en la raíz del monorepo con el nuevo contenido. (Se necesitará Code mode).
2.  **Mantener la Configuración del Proyecto en Vercel Dashboard**:
    *   Root Directory: (vacío)
    *   Framework Preset: `Other`
    *   Build Command: (vacío)
    *   Output Directory: (vacío)
    *   Install Command: `pnpm install`
3.  **Realizar un nuevo deployment** en Vercel.
4.  **Analizar los logs de Vercel** con atención al tiempo de build y cualquier error. Verificar si la página carga.

### Paso 3: Si el Problema Persiste (Consideraciones Adicionales)
-   **"Project settings differ"**: Este mensaje es preocupante. Podría ser necesario:
    -   Revisar todas las configuraciones del proyecto en el Dashboard de Vercel meticulosamente, comparándolas con un proyecto que funcione.
    -   Considerar "redeploying" el último commit exitoso (si hubo alguno) y luego re-introducir los cambios uno por uno.
    -   Contactar al soporte de Vercel con los detalles si nada de esto funciona, ya que podría ser un problema específico de la plataforma con el estado de tu proyecto.
-   **Limpiar Caché de Vercel**: En el Dashboard de Vercel, bajo "Deployments", selecciona el último deployment, y en el menú de tres puntos (opciones), busca una opción para "Redeploy without cache" (o similar).
-   **Simplificar `turbo.json`**: Como último recurso, revisar si hay configuraciones en el `turbo.json` raíz que podrían estar afectando globalmente los builds de manera inesperada.

## Estado:
-   🔴 **FALLO DE BUILD PERSISTENTE** (build de 8ms, 404). El `buildCommand` no se ejecuta.
-   🟡 Sospecha: "Ignored Build Step" en Vercel, o problemas con `turbo run` en Vercel.
-   ⏳ Proponiendo verificar "Ignored Build Step" y luego modificar `vercel.json` para usar `pnpm --filter` directo.