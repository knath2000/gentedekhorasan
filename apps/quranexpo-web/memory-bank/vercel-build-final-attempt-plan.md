# Plan de Intento Final: Vercel Monorepo Build - `vercel.json` y `rewrites`

## Problema Persistente:
El build de `quranexpo-web` en Vercel sigue completándose en ~7-8ms, lo que resulta en un 404 en el sitio desplegado. El `buildCommand` especificado en `vercel.json` no parece estar ejecutándose, a pesar de varios intentos (usando `turbo run --force`, `pnpm --filter`).

**Observaciones Clave de los Últimos Logs:**
-   `WARN! Due to builds existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply.` Esto es **esperado y correcto**. Significa que `vercel.json` está siendo leído y está tomando precedencia.
-   `Skipping build cache since Node.js version changed from "18.x" to "22.x"`: Esto es bueno, asegura que no estamos usando un caché antiguo.
-   `Build Completed in /vercel/output [7ms]`: Este sigue siendo el problema principal. El build *real* no está ocurriendo.

## Hipótesis Actual:
A pesar de que `vercel.json` se está leyendo, hay una desconexión fundamental en cómo `@vercel/static-build` interactúa con el `buildCommand` en el contexto de este monorepo pnpm, o Vercel no está logrando "conectar" la salida del build (que no se está generando) con las rutas esperadas.

## Estrategia de Intento Final: Combinar `builds` con `rewrites` y eliminar el `src` del build.

Vamos a probar un enfoque diferente en `vercel.json`, eliminando la propiedad `src` de la definición del build y utilizando `rewrites` para asegurar que todas las solicitudes se dirijan al output esperado de Astro. Esto a veces ayuda a Vercel a "encontrar" la aplicación correcta cuando el `src` causa ambigüedad en monorepos.

**También vamos a añadir explícitamente el comando `pnpm install --frozen-lockfile` como `installCommand` DENTRO de `vercel.json` para asegurar que las dependencias se instalen en el contexto correcto justo antes del build, y no depender únicamente del Install Command del Dashboard.**

### Contenido Propuesto para `vercel.json` (en la raíz `/Users/kalyannath/quranexpo2/vercel.json`):
```json
{
  "version": 2,
  "installCommand": "pnpm install --frozen-lockfile", // Asegura la instalación en el contexto de vercel.json
  "builds": [
    {
      // "src" eliminado para que Vercel no intente resolverlo como un entrypoint específico
      // y se enfoque en ejecutar el buildCommand y encontrar el distDir.
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "pnpm --filter @quran-monorepo/quranexpo-web run build",
        "distDir": "apps/quranexpo-web/dist"
      }
    }
  ],
  "rewrites": [
    // Reescribe todas las rutas para que sirvan desde el output de Astro
    { "source": "/(.*)", "destination": "/apps/quranexpo-web/dist/$1" }
  ]
}
```

### Explicación de los Cambios:
1.  **`"installCommand": "pnpm install --frozen-lockfile"`**: Se añade directamente a `vercel.json` para tener un control más explícito sobre la instalación de dependencias. `--frozen-lockfile` es una buena práctica para CI.
2.  **`"src"` eliminado de la sección `builds`**:
    *   En algunos casos de monorepo complejos, especificar un `src` puede confundir a Vercel sobre el contexto del build, especialmente si el "Root Directory" del proyecto Vercel está vacío.
    *   Al eliminarlo, Vercel se enfocará en ejecutar el `buildCommand` y luego buscar los archivos en el `distDir` especificado, que es lo que queremos.
3.  **`"rewrites": [{ "source": "/(.*)", "destination": "/apps/quranexpo-web/dist/$1" }]`**:
    *   Esto es un comodín que le dice a Vercel: "Para cualquier solicitud que llegue (`/(.*)`), sírvela desde el directorio `apps/quranexpo-web/dist/` (que es donde Astro construye los archivos)."
    *   Es importante que la ruta en `destination` sea relativa a la raíz del monorepo y coincida con el `distDir` después de que el build se complete.
    *   **Nota:** Esta regla de reescritura asume que todos los assets y páginas están bajo `apps/quranexpo-web/dist/`. Si Astro genera algunas rutas de manera diferente (por ejemplo, assets en un subdirectorio `_astro` directamente bajo `dist`), esto debería funcionar. Si no, la regla de `destination` podría necesitar ajuste, pero `"/apps/quranexpo-web/dist/$1"` es un buen punto de partida.

### Configuración del Vercel Dashboard (Importante):
-   **Root Directory**: Dejar **VACÍO**.
-   **Framework Preset**: `Other`.
-   **Build Command**: **BORRAR/DEJAR VACÍO** (totalmente controlado por `vercel.json`).
-   **Output Directory**: **BORRAR/DEJAR VACÍO** (totalmente controlado por `vercel.json`).
-   **Install Command**: **BORRAR/DEJAR VACÍO** (ahora controlado por `vercel.json`).
-   **"Ignored Build Step"**: Asegurarse de que siga en `Automatic`.

### Por Qué Esto Podría Funcionar:
-   Al eliminar `src` del `builds`, simplificamos lo que Vercel intenta "adivinar".
-   Al añadir `rewrites`, le damos a Vercel una instrucción explícita sobre cómo servir los archivos una vez que (esperemos) se construyan.
-   Mover el `installCommand` a `vercel.json` asegura que se ejecute en el contexto adecuado antes del `buildCommand`.

## Pasos de Implementación:
1.  **Modificar el archivo `vercel.json`** en la raíz del monorepo con el nuevo contenido. (Se necesitará Code mode).
2.  **Asegurar que la Configuración del Proyecto en Vercel Dashboard esté limpia**: Todos los campos de Build & Development (Build Command, Output Directory, Install Command) deben estar vacíos, y Root Directory vacío, Ignored Build Step en Automatic.
3.  **Realizar un nuevo deployment** en Vercel.
4.  **Analizar los logs de Vercel** (tiempo de build, errores) y verificar la página desplegada.

## Si Esto Aún No Funciona:
-   La siguiente etapa sería simplificar el `buildCommand` al máximo, por ejemplo, solo `cd apps/quranexpo-web && astro build`, para ver si la interacción con `pnpm --filter` o `turbo` es el problema dentro de Vercel.
-   Contactar al soporte de Vercel con todos los logs y configuraciones intentadas, ya que podría haber un problema específico de la plataforma o una configuración oscura necesaria para esta combinación.

## Estado:
-   🔴 **FALLO CRÍTICO PERSISTENTE** (build de ~8ms, 404). `buildCommand` no se ejecuta.
-   🟡 Sospecha: Conflicto profundo en cómo Vercel maneja el `src` de builds y el `buildCommand` en monorepos complejos, o cómo sirve el output.
-   ⏳ Proponiendo una reestructuración significativa de `vercel.json` (eliminando `src` de `builds`, añadiendo `installCommand` explícito y `rewrites`).