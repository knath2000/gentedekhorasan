## Contexto Activo: Migración a Despliegue Unificado COMPLETADA ✅

### ✅ MIGRACIÓN COMPLETADA: Despliegue Unificado de Monorepo
**Fecha:** 6 de junio, 2025
**Estado:** Exitosamente migrado de despliegues separados a arquitectura unificada

**Cambios Implementados:**
- ✅ **Variables de Entorno Actualizadas:**
  - `apps/quranexpo-web/.env`: `PUBLIC_QURAN_API_BASE_URL=/api/v1`
  - `apps/quranexpo-web/.env.local`: `PUBLIC_QURAN_API_BASE_URL=/api/v1`
- ✅ **Configuración Limpiada:**
  - Eliminado `apps/quran-data-api/vercel.json` (ya no necesario)
  - Mantenido `vercel.json` en raíz con configuración correcta para despliegue unificado
- ✅ **Arquitectura Final:**
  - Frontend: `quranexpo-web` (Astro + Preact + Tailwind)
  - Backend: `quran-data-api` funciones serverless desplegadas junto al frontend
  - API Endpoints: Accesibles en `/api/v1/*` desde el mismo dominio
  - Base de Datos: Neon PostgreSQL con Prisma ORM

**Próximos Pasos para Despliegue:**
1. Hacer push de cambios al repositorio
2. Configurar Vercel Dashboard:
   - Asegurar que el proyecto se despliega desde la raíz del monorepo
   - Configurar variables de entorno requeridas (`DATABASE_URL`, claves de Clerk)
   - Eliminar cualquier proyecto API separado si existe
3. Probar endpoints de API después del despliegue

---

## Contexto Activo Previo: Problemas de UI, Autenticación y Almacenamiento de Datos

### Problemas Pendientes:
- **Migración completa de `styled-components` en `quranexpo-native`:**
    - Asegurar que no queden referencias a `styled-components` en ningún archivo.
    - Verificar que todos los componentes estilizados han sido refactorizados a `StyleSheet` nativo.
- **Resolución de errores de runtime en `quranexpo-native`:**
    - Confirmar que la aplicación nativa inicia sin errores de `TypeError: Cannot read property 'S' of undefined` o `TypeError: Cannot read property 'default' of undefined`.
    - Asegurar la compatibilidad total con Hermes Engine.
- **Unificación de versiones de React en el monorepo:**
    - Verificar que solo una versión de React (React 18.2.x) está siendo utilizada en todo el monorepo.
- **Verificación de la Implementación de Clerk:**
    - Probar los flujos de login/signup.
    - Verificar la persistencia de sesión.
    - Confirmar que los componentes de Clerk se renderizan correctamente y con el estilo glassmorphism.
    - Asegurarse de que no haya errores en la consola relacionados con Clerk.
- **Verificación de la API de Bookmarks:**
    - Probar los endpoints GET, POST, PUT, DELETE para bookmarks.
    - Asegurarse de que los bookmarks se guardan y recuperan correctamente por usuario.
- **Verificación de la Migración de Bookmarks (futuro):**
    - Asegurarse de que los bookmarks de localStorage se migran correctamente a la base de datos.
- **Verificación de la Integración Frontend de Bookmarks (futuro):**
    - Actualizar la UI para interactuar con la nueva API de bookmarks.
- **Problema de la Página de Sura (CORS y Prisma):** El problema persiste a pesar de los intentos de solución. La depuración de este problema se ha **pausado** por instrucción del usuario y se reanudará mañana.

### Acciones Tomadas Recientemente:
- **Resolución de Conflictos de Versiones de React:**
    - Se diagnosticó un conflicto de versiones de React (React 19 en `quranexpo-web` y React 18 en `quranexpo-native`) debido al `hoisting` de pnpm.
    - Se unificaron las versiones de React en todo el monorepo a React 18.2.x.
- **Migración de `styled-components` a `StyleSheet` nativo en `quranexpo-native`:**
    - Se inició la migración de `styled-components` a `StyleSheet` nativo para resolver errores de runtime con Hermes Engine.
    - Se corrigió `apps/quranexpo-native/app/_layout.tsx` (typo en variable de entorno de Clerk, eliminación de importaciones web y contenido HTML).
    - Se crearon `apps/quranexpo-native/src/theme/nativeTheme.js` y `apps/quranexpo-native/src/theme/ThemeContext.js` para el tema nativo.
    - Se actualizó `apps/quranexpo-native/src/components/ThemeProvider.tsx` para usar el nuevo `ThemeContext`.
    - Se migró `apps/quranexpo-native/app/(tabs)/settings.tsx` para usar las propiedades del tema nativo.
    - Se migró `apps/quranexpo-native/src/components/AnimatedBackground.tsx` para usar `StyleSheet` y contener `LottieView`.
    - Se actualizó `apps/quranexpo-native/app/(tabs)/index.tsx` para usar `AnimatedBackground` correctamente.
    - Se migró `apps/quranexpo-native/src/components/VerseOfTheDay.tsx` para usar `StyleSheet` y el nuevo tema.
    - Se creó y ejecutó `apps/quranexpo-native/fix-styled-components.sh` para identificar archivos restantes.
    - Se eliminaron `apps/quranexpo-native/src/styled-config.js` y `apps/quranexpo-native/src/types/nativeTheme.d.ts` (o `src/styled.d.ts`).
- **Solución Definitiva para Blur Modal:** Se implementó la solución definitiva para el blur del modal, eliminando el JavaScript de blur y confiando únicamente en `backdrop-filter`.
    - **CSS:** Se eliminó la clase `.modal-blur-content` de `apps/quranexpo-web/src/styles/global.css` ya que no es necesaria.
    - **SurahDescriptionModal.tsx:**
        - Se **eliminó completamente el `useEffect`** que aplicaba `filter: blur()` a elementos DOM.
        - El `Backdrop` (línea 159) se configuró con `bg-skyDeepBlue/85 backdrop-blur-2xl z-40` para un desenfoque intenso y un fondo más opaco.
        - Se simplificó el `className` del modal principal (líneas 162-167) volviendo el `z-index` a `z-50` y eliminando `style={{ filter: 'none !important' }}` y la clase `modal-no-blur`, ya que el modal no debería recibir blur si el `body` no lo tiene.
    - **ReaderSurahHeader.tsx:** Se añadió la prop `onModalStateChange?: (isOpen: boolean) => void`, y esta se invoca en `openModal` y `closeModal` para notificar al componente padre sobre el estado del modal.
    - **ReaderContainer.tsx:** Se añadió un estado `isDescriptionModalOpen` y un `handleModalStateChange`, el cual se pasa como `onModalStateChange` al `ReaderSurahHeader`. Se pasó la prop `isModalOpen={isDescriptionModalOpen}` al `BottomControlPanel`.
    - **BottomControlPanel.tsx:** Se añadió la prop `isModalOpen?: boolean;` a la interfaz y al componente, y se aplicaron clases condicionales (`${isModalOpen ? 'opacity-0 invisible translate-y-4' : 'opacity-100 visible translate-y-0'}`) para ocultar/mostrar el panel con una transición suave.
    - **Data Attributes:** Los `data attributes` (`data-bottom-panel`, `data-surah-header`, `data-verse-card`) fueron eliminados de sus respectivos componentes ya que ya no son necesarios con la nueva estrategia de blur.
    - La jerarquía final de `z-index` ahora es: Contenido principal (sin z-index o z-0 implícito) < `z-10` (BottomControlPanel) < `z-40` (Backdrop del modal) < `z-50` (Modal principal).
- **Cambio de Títulos de Surahs a Transliteración Inglesa:** Se modificaron `ReactSurahCard.tsx`, `SurahDescriptionModal.tsx` y `ReaderSurahHeader.tsx` para usar `surah.transliterationName` en lugar de `surah.englishName` para los títulos de las surahs, buscando mayor autenticidad y consistencia. Se actualizó el log de debug en `SurahListContainer.tsx`.
- **Corrección del Problema de Transliteración:** Se simplificó `SurahListContainer.tsx` para eliminar la dependencia de `fetchTransliterationNames()` y el `transliterationMap`, confiando únicamente en el `tname` proporcionado directamente por `fetchSurahList()`. Se eliminó el archivo `/api/transliterations.ts` y la función `fetchTransliterationNames()` de `apiClient.ts`.
- **Ajuste del Tamaño del Panel de Navegación:** Se modificó `apps/quranexpo-web/src/components/BottomControlPanel.tsx` para eliminar el ancho fijo (`w-[calc(100%-2rem)]` y `max-w-md`) y ajustar el padding horizontal (`px-6`) del `div` principal, permitiendo que el panel se ajuste mejor a los botones de navegación.
- **Implementación de Autenticación con Clerk:**
    - **Instalación:** Se instaló `@clerk/astro` y `@astrojs/node`.
    - **Variables de Entorno:** Se agregaron `PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` al `.env.local`.
    - **Middleware:** Se creó `apps/quranexpo-web/src/middleware.ts` (solución al error `Astro2.locals.auth is not a function`).
    - **Configuración de Astro:** Se modificó `apps/quranexpo-web/astro.config.mjs` para usar `output: 'server'`, el adaptador `node` y la integración de `clerk`.
    - **Componente AuthSection:** Se creó `apps/quranexpo-web/src/components/AuthSection.astro` para usar los componentes nativos de `@clerk/astro/components` y se aplicaron estilos glassmorphism.
    - **Integración en Settings:** Se modificó `apps/quranexpo-web/src/pages/settings.astro` para usar el nuevo `AuthSection.astro` y un `Layout.astro` básico.
    - **Creación de Layout:** Se creó `apps/quranexpo-web/src/layouts/Layout.astro`.
    - **Actualización de SettingsToggle:** Se modificó `apps/quranexpo-web/src/components/SettingsToggle.tsx` para aceptar la prop `description` y `storeKey`.
    - **Limpieza:** Se desinstalaron `@clerk/clerk-js` y `@clerk/clerk-react`.
    - **Botón de Cerrar Sesión:** Se añadió un `SignOutButton` funcional a `AuthSection.astro` con estilos consistentes.
- **Adición de Botón de Retroceso a Settings:** Se añadió el componente `BackButton.tsx` a `apps/quranexpo-web/src/pages/settings.astro`, permitiendo al usuario navegar de vuelta a la página del lector.
- **Corrección de Autoplay al Cargar Página:** Se eliminó la lógica de reproducción automática inicial en `apps/quranexpo-web/src/components/ReaderContainer.tsx` (líneas 101-105) para que el audio no se reproduzca al cargar la página, respetando la interacción del usuario. La lógica de autoplay entre versos en `useVersePlayer.ts` se mantiene intacta.
- **Corrección de Hidratación de Settings Toggle:** Se cambió la directiva de hidratación de `client:load` a `client:only="preact"` en ambas instancias de `SettingsToggle` en `apps/quranexpo-web/src/pages/settings.astro`. Esto asegura que el componente solo se renderice en el cliente, eliminando el problema de inconsistencia visual al navegar.
- **Implementación de Almacenamiento de Bookmarks (Fase 1 y 2):**
    - Se añadió el modelo `UserBookmark` al esquema de Prisma en `apps/quran-data-api/prisma/schema.prisma`.
    - Se creó el endpoint de la API para los bookmarks de usuario en `apps/quran-data-api/api/v1/user-bookmarks.ts`, que incluye las operaciones GET, POST, PUT y DELETE.
    - Se instaló `@clerk/backend` en `apps/quran-data-api` y se actualizó la importación de `getAuth` en el nuevo endpoint para usarlo.

### Decisiones y Consideraciones Recientes:
- La aplicación `quranexpo-web` se basa en `Astro`, `Preact` y `React`.
- La API `quran-data-api` utiliza `Vercel Serverless Functions`, `TypeScript`, `Neon PostgreSQL` y `Prisma ORM`.
- Se decidió usar `@libsql/client` directamente en el endpoint de la API para `surah_descriptions` debido a problemas persistentes con `prisma generate` y el adaptador `libsql`.
- Se adoptó una estrategia de `backdrop-filter` para el blur del modal, eliminando la manipulación de `filter` con JavaScript.
- Se optó por la integración nativa de `@clerk/astro` y su middleware para la autenticación, en lugar de `@clerk/clerk-js` imperativo.
- Se recomendó TursoDB para el almacenamiento de bookmarks de usuario debido a su alineación arquitectónica, soporte para estructuras de datos ricas, escalabilidad y rendimiento global.