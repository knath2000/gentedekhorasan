# QuranExpo Web Build Errors Solution

## Current Status
The Vercel deployment configuration is now working correctly. The build process:
- ✅ Successfully clones the repository
- ✅ Installs dependencies using pnpm
- ✅ Starts the build process
- ❌ Fails during static site generation due to runtime errors

## Build Errors

### 1. Edge Config Error
```
Error fetching transliterations from Edge Config: Error: @vercel/edge-config: No connection string provided
```

**Location**: `src/pages/api/transliterations.ts`

**Cause**: The app expects a Vercel Edge Config connection string which isn't provided during build time.

**Solution Options**:
1. Add error handling to gracefully handle missing Edge Config during build
2. Set up Edge Config in Vercel Dashboard
3. Make the API endpoint dynamic-only (not pre-rendered)

### 2. Preact Hooks Error
```
Cannot read properties of undefined (reading '__H')
```

**Location**: Occurs when rendering `/reader/1/index.html`

**Cause**: This is typically a React/Preact hooks error that occurs when:
- Hooks are called outside of components
- Multiple versions of React/Preact are loaded
- SSR/SSG compatibility issues with hooks

**Solution**: Need to investigate the component causing this issue, likely in the reader page components.

## Recommended Next Steps

### Step 1: Fix Edge Config Error
Add error handling in `apps/quranexpo-web/src/pages/api/transliterations.ts`:

```typescript
export async function GET() {
  try {
    const transliterations = await get('transliterations');
    return new Response(JSON.stringify(transliterations || {}), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.warn('Edge Config not available during build:', error);
    // Return empty object during build
    return new Response(JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### Step 2: Fix Preact Hooks Error
1. Check for hooks usage in components rendered in `reader/[surahId].astro`
2. Ensure no hooks are called at the module level
3. Check for version conflicts between React and Preact

### Step 3: Environment Variables
Set up any required environment variables in Vercel Dashboard:
- Edge Config connection strings
- API keys
- Other configuration

## Summary
The deployment configuration is now correct. These are application-level issues that need to be fixed in the code. Once these errors are resolved, the build should complete successfully.