# Vercel.json Update

To fix the API routing issue, the `vercel.json` file should be updated to more explicitly handle the API endpoints. The current configuration routes API requests correctly, but being more specific about the file extension could help with the 404 issue.

## Current Configuration

```json
{
  "version": 2,
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

## Recommended Update

```json
{
  "version": 2,
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
      "src": "/api/([^/]+)",
      "dest": "/api/$1.js"
    }
  ]
}
```

This updated configuration specifically maps API requests like `/api/get-metadata` to `/api/get-metadata.js`, which is what Vercel produces during the build process from TypeScript files.

## Implementation Steps

1. Update the `vercel.json` file with the new configuration
2. Commit and push the changes
3. Deploy to Vercel
4. Test the API endpoint by visiting:
   `https://onlyquranexpo.vercel.app/api/get-metadata?type=surah-list`

## Alternative Approach

If the above approach doesn't work, you could try an even more explicit configuration:

```json
{
  "version": 2,
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
      "src": "/api/get-metadata",
      "dest": "/api/get-metadata.js"
    },
    {
      "src": "/api/get-verse",
      "dest": "/api/get-verse.js"
    },
    {
      "src": "/api/get-verses",
      "dest": "/api/get-verses.js"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

This explicitly handles each API endpoint individually, which can be helpful for debugging.