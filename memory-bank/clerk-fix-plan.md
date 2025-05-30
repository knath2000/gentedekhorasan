# Plan de Corrección: Errores de Clerk en QuranExpo Web

## 🚨 Problemas Identificados

### 1. **Error Principal: Módulo No Encontrado**
```
Cannot find module '@clerk/astro' imported from astro.config.mjs
```

### 2. **Inconsistencia de Paquetes**
- **Configurado en astro.config.mjs**: `@clerk/astro` (NO instalado)
- **Instalado en package.json**: `@clerk/clerk-js` y `@clerk/clerk-react`

### 3. **Variables de Entorno Faltantes**
```
PUBLIC_CLERK_PUBLISHABLE_KEY is missing
```
- Archivo `.env.local` no existe

### 4. **Adaptador SSR Faltante**
```
[@clerk/astro/integration] Missing adapter, please update your Astro config to use one.
```

## 🎯 Estrategia de Solución

**Recomendación**: Migrar a `@clerk/astro` oficial para una integración más robusta y nativa con Astro.

### Ventajas de `@clerk/astro`:
- ✅ Integración nativa con Astro SSR
- ✅ Middleware automático
- ✅ Componentes optimizados para Astro
- ✅ Mejor manejo de hidratación
- ✅ Soporte oficial y documentación completa

## 📋 Plan de Implementación

### **Fase 1: Instalación y Configuración Base**

#### 1.1 Instalar Paquetes Requeridos
```bash
cd apps/quranexpo-web
npm install @clerk/astro @astrojs/node
```

#### 1.2 Crear Variables de Entorno
Crear `apps/quranexpo-web/.env.local`:
```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

#### 1.3 Actualizar astro.config.mjs
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import clerk from '@clerk/astro';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  outDir: './dist',
  integrations: [
    preact({
      include: ['**/*.tsx']
    }),
    tailwind(),
    clerk()
  ],
  vite: {
    ssr: {
      noExternal: ['@tanstack/react-virtual']
    },
    resolve: {
      alias: {
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
    },
  }
});
```

### **Fase 2: Simplificar Componentes**

#### 2.1 Actualizar AuthSection.tsx
Simplificar para usar componentes nativos de `@clerk/astro`:

```tsx
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/astro/components';

export default function AuthSection() {
  return (
    <div className="bg-glassmorphism-strong backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-xl font-semibold text-textPrimary mb-4">Account</h2>
      
      <SignedOut>
        <div className="space-y-3">
          <SignInButton mode="modal">
            <button className="w-full bg-desertHighlightGold hover:bg-desertHighlightGold/80 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Sign In
            </button>
          </SignInButton>
          
          <SignUpButton mode="modal">
            <button className="w-full bg-skyDeepBlue hover:bg-skyDeepBlue/80 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "bg-glassmorphism-strong backdrop-blur-md border border-white/20"
                }
              }}
            />
            <span className="text-textPrimary">Welcome back!</span>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
```

#### 2.2 Actualizar settings.astro
Simplificar la página de settings:

```astro
---
import Layout from '../layouts/Layout.astro';
import SettingsToggle from '../components/SettingsToggle.tsx';
import AuthSection from '../components/AuthSection.tsx';
---

<Layout title="Settings - QuranExpo">
  <main class="min-h-screen bg-gradient-to-br from-skyLightBlue via-skyMediumBlue to-skyDeepBlue p-4">
    <div class="max-w-md mx-auto pt-8 space-y-6">
      
      <!-- Account Section -->
      <AuthSection client:load />
      
      <!-- App Settings Section -->
      <div class="bg-glassmorphism-strong backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 class="text-xl font-semibold text-textPrimary mb-4">App Settings</h2>
        
        <div class="space-y-4">
          <SettingsToggle 
            client:load
            label="Autoplay"
            description="Automatically play next ayah"
            storeKey="autoplayEnabled"
          />
          
          <SettingsToggle 
            client:load
            label="Show Translation"
            description="Display English translation"
            storeKey="showTranslation"
          />
        </div>
      </div>
      
    </div>
  </main>
</Layout>
```

### **Fase 3: Limpieza**

#### 3.1 Remover Dependencias Innecesarias
```bash
npm uninstall @clerk/clerk-js @clerk/clerk-react
```

#### 3.2 Eliminar Middleware Manual
Eliminar `apps/quranexpo-web/src/middleware.ts` (ya no necesario con `@clerk/astro`)

### **Fase 4: Configuración de Clerk Dashboard**

#### 4.1 Configurar Dominios Permitidos
En Clerk Dashboard → Settings → Domains:
- Agregar `http://localhost:4321` para desarrollo
- Agregar dominio de producción cuando esté listo

#### 4.2 Configurar Redirect URLs
- Sign-in redirect: `/settings`
- Sign-up redirect: `/settings`
- Sign-out redirect: `/`

## 🧪 Pruebas de Verificación

### Checklist de Funcionalidad:
- [ ] `npm run dev` ejecuta sin errores
- [ ] Página `/settings` carga correctamente
- [ ] Botones "Sign In" y "Sign Up" abren modales
- [ ] Proceso de registro funciona
- [ ] Proceso de login funciona
- [ ] UserButton aparece cuando está autenticado
- [ ] Sign out funciona correctamente
- [ ] Estilos glassmorphism se aplican correctamente
- [ ] No hay errores en consola del navegador

## 🔧 Comandos de Implementación

```bash
# 1. Instalar dependencias
cd apps/quranexpo-web
npm install @clerk/astro @astrojs/node

# 2. Crear archivo de variables de entorno
touch .env.local
# (Agregar las variables manualmente)

# 3. Remover dependencias innecesarias
npm uninstall @clerk/clerk-js @clerk/clerk-react

# 4. Probar la aplicación
npm run dev
```

## 📊 Beneficios de Esta Solución

1. **Integración Nativa**: Uso del SDK oficial de Clerk para Astro
2. **Menos Código**: Eliminación de lógica manual de autenticación
3. **Mejor Performance**: Optimizaciones nativas de Astro + Clerk
4. **Mantenibilidad**: Código más simple y estándar
5. **Escalabilidad**: Base sólida para futuras funciones de usuario
6. **Soporte**: Documentación oficial y comunidad activa

## 🚀 Próximos Pasos Después de la Corrección

1. **Personalización de UI**: Ajustar temas de Clerk para match perfecto
2. **Protección de Rutas**: Implementar rutas protegidas si es necesario
3. **Datos de Usuario**: Integrar información de usuario en la aplicación
4. **Roles y Permisos**: Configurar si se requieren diferentes niveles de acceso