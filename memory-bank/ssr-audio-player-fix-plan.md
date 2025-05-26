# Plan de Corrección: Error SSR en Audio Player

## Problema Identificado

El error `Cannot read properties of undefined (reading '__H')` ocurre porque el hook `useVersePlayer` intenta crear instancias de `HTMLAudioElement` durante el Server-Side Rendering (SSR), donde las APIs del navegador no están disponibles.

**Ubicación específica del error:**
- Archivo: `apps/quranexpo-web/src/hooks/useVersePlayer.ts`
- Líneas problemáticas: 73-76, 125
- Causa: `new Audio()` y `new AudioPool()` durante SSR

## Estrategia de Solución: Híbrida SSR + Client Hydration

### 1. Crear Hook de Detección de Cliente

**Archivo:** `apps/quranexpo-web/src/hooks/useIsClient.ts`

```typescript
import { useEffect, useState } from 'preact/hooks';

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
```

### 2. Hacer AudioPool SSR-Safe

**Modificar:** `apps/quranexpo-web/src/hooks/useVersePlayer.ts`

**Cambios principales:**

1. **Verificación de entorno en AudioPool:**
```typescript
class AudioPool {
  private pool: HTMLAudioElement[] = [];
  private activeAudio: HTMLAudioElement | null = null;
  private audioIdCounter = 0;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  getAudioInstance(): HTMLAudioElement | null {
    if (!this.isClient) return null;
    
    if (this.pool.length > 0) {
      const audio = this.pool.pop()!;
      console.log(`[AudioPool] Reutilizando instancia. Pool size: ${this.pool.length}`);
      return audio;
    }
    const audio = new Audio();
    audio.id = `audio-${++this.audioIdCounter}`;
    console.log(`[AudioPool] Nueva instancia: ${audio.id}. Pool size: ${this.pool.length}`);
    return audio;
  }
  
  // ... resto de métodos con verificaciones isClient
}
```

2. **Modificar useVersePlayer principal:**
```typescript
export const useVersePlayer = (verses?: Verse[]) => {
  const isClient = useIsClient();
  const audioPoolRef = useRef<AudioPool | null>(null);
  
  // Inicializar AudioPool solo en el cliente
  useEffect(() => {
    if (isClient && !audioPoolRef.current) {
      audioPoolRef.current = new AudioPool();
    }
  }, [isClient]);

  // Estado inicial seguro para SSR
  const [state, dispatch] = useReducer(audioReducer, {
    status: 'idle',
    error: null,
    duration: 0,
    currentTime: 0,
    currentVerseKey: null,
  });

  // ... resto del hook con guards isClient
}
```

### 3. Crear Wrapper para ReaderContainer

**Archivo:** `apps/quranexpo-web/src/components/ClientOnlyReaderContainer.tsx`

```typescript
import { h } from 'preact';
import { useIsClient } from '../hooks/useIsClient';
import ReaderContainer from './ReaderContainer';

interface ClientOnlyReaderContainerProps {
  surahId: number;
}

const ClientOnlyReaderContainer = ({ surahId }: ClientOnlyReaderContainerProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    // Render skeleton/loading durante SSR
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <ReaderContainer surahId={surahId} />;
};

export default ClientOnlyReaderContainer;
```

### 4. Actualizar Página Reader

**Modificar:** `apps/quranexpo-web/src/pages/reader/[surahId].astro`

```astro
---
// ... imports existentes
import ClientOnlyReaderContainer from '../../components/ClientOnlyReaderContainer';
---

<Layout title={`Surah ${surahId} - QuranExpo`}>
  <Background />
  <main class="relative z-10 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <ClientOnlyReaderContainer surahId={parseInt(surahId)} client:load />
    </div>
  </main>
</Layout>
```

### 5. Modificaciones Adicionales

**A. Hacer usePagination SSR-Safe:**
- Verificar si también usa APIs del navegador
- Aplicar misma estrategia si es necesario

**B. Proteger otros hooks de browser APIs:**
- Revisar `useStore` de nanostores
- Asegurar que settings stores sean SSR-compatible

**C. Optimizar skeleton loading:**
- Crear skeleton components que coincidan con el layout final
- Evitar layout shift durante hidratación

## Beneficios de Esta Estrategia

1. **SEO Optimizado:** Contenido básico se renderiza en servidor
2. **Performance:** Carga inicial rápida con contenido estático
3. **Funcionalidad Completa:** Audio player se activa después de hidratación
4. **User Experience:** Skeleton loading previene flashes de contenido
5. **Escalabilidad:** Patrón reutilizable para otros componentes client-only

## Orden de Implementación

1. ✅ Crear `useIsClient` hook
2. ✅ Modificar `AudioPool` class con verificaciones SSR
3. ✅ Actualizar `useVersePlayer` para ser SSR-safe
4. ✅ Crear `ClientOnlyReaderContainer` wrapper
5. ✅ Actualizar página reader para usar wrapper
6. ✅ Verificar `usePagination` hook
7. ✅ Testing y optimización

## Testing Plan

1. **SSR Testing:** Verificar que build estático se complete sin errores
2. **Client Hydration:** Confirmar que audio player funciona después de carga
3. **Performance:** Medir tiempo de carga inicial vs funcionalidad completa
4. **UX:** Verificar que skeleton loading sea smooth

---

**Estado:** Listo para implementación en modo Code
**Prioridad:** Alta - Blocking deployment
**Estimación:** 2-3 horas de implementación + testing