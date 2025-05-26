# progress.md

## Qué funciona
- El efecto de glasmorfismo se ha aplicado correctamente a las tarjetas (`VerseOfTheDay.tsx`, `SurahCard.tsx`, `ReaderVerseCard.tsx`).
- El componente `AudioControlsPopup.tsx` ha sido renombrado a `BottomControlPanel.tsx` y refactorizado para combinar los controles de audio y paginación en un solo componente persistente en la parte inferior de la pantalla.
- El servidor de desarrollo se inicia correctamente sin errores de renderizado.
- El componente `BottomNavigation.tsx` ha sido completamente eliminado del código base.
- La funcionalidad del `BottomControlPanel` en la página del lector ha sido verificada y funciona correctamente.
- **El `BottomControlPanel.tsx` ha sido modificado para estar fijo en la parte inferior central de la página, tiene un fondo blanco plateado cromado, y los controles de audio se muestran por encima de los controles de paginación.**
- **Se ha resuelto el problema de la visibilidad de los controles de audio para suras con 7 o menos versos: el `BottomControlPanel` ahora se muestra solo durante la reproducción de audio para estas suras, mostrando únicamente los controles de audio y ocultando los botones de navegación.**
- `src/services/apiClient.ts` está configurado para usar la API de `quran-api-data` desplegada en Vercel (`https://gentedekhorasan.vercel.app/api/v1`).

## Qué queda por construir
- Ninguno. La funcionalidad de marcadores está actualizada.

## Estado del Deployment en Vercel
- **✅ quranexpo-web:** Desplegado exitosamente en Vercel.
    - **Problemas Resueltos:**
        - Conflicto de Prisma (`prisma: command not found`) durante `pnpm install` en el monorepo.
        - Versión de Node.js (`18.x` vs `22.x`).
        - Errores de registro de pnpm (`ERR_INVALID_THIS`, `ERR_PNPM_META_FETCH_FAIL`).
    - **Solución Final:**
        - **Root Directory:** `apps/quranexpo-web`
        - **Build Command:** `npm run build`
        - **Output Directory:** `dist`
        - **Install Command:** `npm install`
        - **Node.js Version:** `22.x`
    - **Razón:** El aislamiento del proyecto en Vercel y el cambio de `pnpm` a `npm` para `quranexpo-web` resolvieron los problemas de compatibilidad y los conflictos del monorepo.

## Estado actual
- La funcionalidad de marcadores ha sido actualizada:
    - Se ha añadido el botón de marcadores a la página de suras (`src/pages/surahs.astro`).
    - Se ha eliminado el icono de marcadores de cada verso en la página del lector (`src/components/ReaderVerseCard.tsx`).
    - Se ha implementado la funcionalidad de pulsación larga en `ReaderVerseCard.tsx` para añadir/eliminar marcadores.
    - Se ha modificado `SurahCard.tsx` para mostrar el nombre de la sura en transliteración inglesa como título y el nombre en inglés simple como subtítulo.
- Los archivos del banco de memoria (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `progress.md`) han sido actualizados para reflejar estos cambios.

## Problemas conocidos
- Ninguno actualmente.

## Evolución de las decisiones del proyecto
- Se decidió implementar la funcionalidad completa de marcadores, lo que representa un cambio de alcance con respecto a la versión inicial.
- Se decidió cambiar la interacción de marcado de un clic en un icono a una pulsación larga en la tarjeta del verso para simplificar la UI del lector.
- Se decidió añadir un botón de marcadores dedicado en la página de suras para facilitar el acceso a los marcadores.
