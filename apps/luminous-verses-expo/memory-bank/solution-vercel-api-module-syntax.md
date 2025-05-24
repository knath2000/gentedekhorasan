# Solution: Fixing Vercel API Module Syntax Error

## Problem Analysis

We're encountering two key issues with the Vercel API deployment:

1. **Module System Mismatch**: The error message "Unexpected token 'export'" in the logs indicates a conflict between ES modules and CommonJS. Our `tsconfig.json` specifies `"module": "esnext"`, but Vercel's serverless functions expect CommonJS format.

2. **Edge Config Connection Missing**: The logs show "EDGE_CONFIG connection string not found," indicating that the environment variable isn't properly configured in the Vercel deployment.

## Root Causes

1. **TypeScript Configuration Issue**: Our global `tsconfig.json` is configured for modern ESNext modules (`"module": "esnext"`), which works well for the React Native app but causes issues with Vercel's serverless function runtime.

2. **Environment Variable Configuration**: The Edge Config connection string is not properly set in the Vercel project settings.

## Solution Steps

### 1. Create a Specialized TypeScript Configuration for API Routes

Create a separate `tsconfig.json` specifically for the `/api` directory that uses CommonJS modules:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "target": "es2017",
    "outDir": "../dist/api",
    "rootDir": "./",
    "esModuleInterop": true
  },
  "include": [
    "./**/*.ts"
  ]
}
```

This configuration will ensure that TypeScript files in the API directory are compiled to CommonJS format.

### 2. Update Vercel Configuration

Add a build configuration to `vercel.json` to specify how API routes should be built:

```json
{
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["api/tsconfig.json"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

### 3. Fix Syntax in API Files

While `api/get-metadata.ts` appears to be using CommonJS syntax already with `module.exports =`, we need to ensure all imports also use CommonJS syntax consistently. This should be automatically handled by the specialized `tsconfig.json` once implemented.

### 4. Configure Edge Config Environment Variable

In the Vercel dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add the `EDGE_CONFIG` variable with the connection string value
4. Ensure the variable is applied to all environments (Production, Preview, Development)

The connection string format should be: `https://edge-config.vercel.com/[config-id]_[secret]`

### 5. Implement Local Fallback for Edge Config

To ensure the application works in local development without Edge Config:

```typescript
// In src/services/quranMetadataService.ts

// Add a local fallback for when Edge Config is not available:
let edgeConfigClient: EdgeConfigClient | undefined;
let localEdgeConfigData: QuranEdgeConfigData | undefined;

// Initialize Edge Config or local fallback
if (process.env.EDGE_CONFIG) {
  try {
    edgeConfigClient = createClient(process.env.EDGE_CONFIG);
  } catch (error) {
    console.error("Failed to create Edge Config client:", error);
    initializeLocalFallback();
  }
} else {
  console.warn("EDGE_CONFIG connection string not found. Using local fallback data.");
  initializeLocalFallback();
}

// Function to initialize local fallback data
async function initializeLocalFallback() {
  try {
    // If in development, try to load local data
    if (__DEV__) {
      // First try API
      const surahList = await fetchMetadataFromAPI<SurahBasicInfo[]>('surah-list');
      if (surahList) {
        localEdgeConfigData = { surahBasicInfo: surahList };
        console.info("Using API data as local Edge Config fallback");
        return;
      }
      
      // If API fails, use static data if available
      // This could be imported from a local JSON file
      // import localData from './local-edge-config-data.json';
      // localEdgeConfigData = localData;
    }
  } catch (error) {
    console.error("Failed to initialize local fallback data:", error);
  }
}
```

## Testing Strategy

1. **Local Development Testing**:
   - Test API endpoints locally using `vercel dev`
   - Verify the application works with and without Edge Config

2. **Vercel Preview Deployment**:
   - Push changes to a non-production branch
   - Verify serverless functions work in the preview deployment
   - Check Edge Config integration

3. **Production Verification**:
   - After successful preview tests, deploy to production
   - Verify all metadata endpoints are working
   - Confirm the Surah page loads correctly

## Additional Considerations

1. **Error Handling**: Implement more robust error handling in serverless functions to provide clearer error messages.

2. **Caching**: Consider implementing caching for metadata API responses to reduce database load.

3. **Development/Production Parity**: Ensure development and production environments are as similar as possible to catch these types of errors earlier.

4. **TypeScript Configuration**: Long-term, we may want to standardize on either CommonJS or ES modules throughout the project to avoid these kinds of issues.