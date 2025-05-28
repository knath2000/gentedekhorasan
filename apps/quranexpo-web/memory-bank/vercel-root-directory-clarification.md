# Clarificación: Root Directory en Vercel Dashboard con `vercel.json`

## Pregunta del Usuario:
> Root directory cannot be set as '.' can I leave it empty?

## Respuesta y Explicación:

Sí, cuando estás utilizando un archivo `vercel.json` en la raíz de tu monorepo para definir los builds (como en la solución propuesta con `@vercel/static-build`), **dejar el campo "Root Directory" vacío en el Vercel Dashboard es a menudo el comportamiento correcto y deseado.**

### Por qué dejarlo vacío (o cómo Vercel lo interpreta):

1.  **`vercel.json` toma precedencia**: Cuando Vercel detecta un `vercel.json` en la raíz del repositorio que clona, las configuraciones dentro de este archivo (especialmente la sección `builds`) anulan muchas de las configuraciones del UI del Dashboard.
2.  **Contexto de ejecución de `vercel.json`**:
    *   El `installCommand` (si está definido en el Dashboard) generalmente se ejecuta desde la raíz del repositorio clonado (que es el comportamiento predeterminado si "Root Directory" está vacío).
    *   Los `buildCommand` dentro de la sección `builds` de `vercel.json` también se ejecutan con la raíz del repositorio clonado como el directorio de trabajo actual, a menos que se especifique lo contrario mediante comandos `cd` dentro del propio `buildCommand`.
    *   Las rutas como `distDir` en `vercel.json` se resuelven relativas a la raíz del repositorio.
3.  **Comportamiento predeterminado de "Root Directory"**: Si dejas el campo "Root Directory" vacío en el Dashboard, Vercel usa la raíz del repositorio que ha clonado como el directorio raíz para el proyecto. Esto es exactamente lo que necesitamos cuando `vercel.json` está en la raíz y define builds para subdirectorios (e.g., `apps/quranexpo-web`).

### Configuración Recomendada en Vercel Dashboard (con el `vercel.json` propuesto en la raíz):

*   **Framework Preset**: `Other`
*   **Build Command**: (Dejar vacío - controlado por `vercel.json`)
*   **Output Directory**: (Dejar vacío - controlado por `distDir` en `vercel.json`)
*   **Install Command**: `pnpm install` (o tu comando de instalación para el monorepo)
*   **Root Directory**: (Dejar vacío)

### Qué Sucede:
1.  Vercel clona tu repositorio.
2.  Detecta que "Root Directory" está vacío, por lo que usa la raíz del repo clonado.
3.  Ejecuta el "Install Command" (e.g., `pnpm install`) desde esta raíz, instalando dependencias para todo el monorepo.
4.  Lee el `vercel.json` en la raíz.
5.  Para la entrada de `builds` correspondiente a `apps/quranexpo-web/package.json`:
    *   Ejecuta el `config.buildCommand` (e.g., `pnpm turbo run build --filter=@quran-monorepo/quranexpo-web`) desde la raíz del repo.
    *   Espera los artefactos de build en `config.distDir` (e.g., `apps/quranexpo-web/dist`), relativo a la raíz del repo.

Esto asegura que Turborepo funcione correctamente (ya que necesita ejecutarse desde la raíz para "ver" todos los workspaces) y que Vercel pueda localizar los archivos construidos de `quranexpo-web`.

Por lo tanto, sí, puedes y debes dejar el campo "Root Directory" vacío en el Vercel Dashboard cuando uses la configuración de `vercel.json` en la raíz que hemos discutido.