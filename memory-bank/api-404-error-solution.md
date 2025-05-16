# API 404 Error Solution Plan

## Database Schema Verification ✅

The database schema looks correct based on the CSV file. The `quran_surahs` table has all the required columns used in the API query:

| Column Name | Data Type | Required |
|-------------|-----------|----------|
| number | integer | YES |
| arabic_name | text | YES |
| transliteration | text | YES |
| english_name | text | YES |
| ayas | integer | YES |
| start_index | integer | NO |
| revelation_type | text | YES |
| chronological_order | integer | YES |
| rukus | integer | YES |

The SQL query in the API endpoint matches these column names (with appropriate aliases):

```sql
SELECT number, arabic_name AS name, transliteration AS tname, 
english_name AS ename, ayas, revelation_type AS type, 
chronological_order AS "order", rukus 
FROM quran_surahs ORDER BY number
```

## Likely Causes of the 404 Error

Since the database schema is correct, the 404 error is likely caused by:

1. **API Endpoint Deployment Issue** - The serverless function might not be correctly deployed
2. **API Route Configuration Issue** - The routes in vercel.json might need updating
3. **URL Mismatch** - There might be a mismatch between the configured API_BASE_URL and the actual deployment

## Solution Steps

### 1. Update Vercel.json Route Configuration

Current configuration:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

Recommended update:
```json
{
  "routes": [
    {
      "src": "/api/([^/]+)",
      "dest": "/api/$1.js"
    }
  ]
}
```

This explicitly maps requests like `/api/get-metadata` to `/api/get-metadata.js`, which is what Vercel produces during build from TypeScript files.

### 2. Verify API_BASE_URL Configuration

The current API_BASE_URL in app.json is:
```
"API_BASE_URL": "https://onlyquranexpo.vercel.app"
```

Verify this matches your actual Vercel deployment URL. You can check in the Vercel dashboard under "Domains".

### 3. Check Vercel Deployment Status

1. Go to the Vercel dashboard
2. Select your project
3. Navigate to "Deployments" and check the latest deployment
4. Look for any build or runtime errors
5. Check the "Functions" tab to verify the API endpoints are properly deployed

### 4. Test API Endpoint Directly

Visit: `https://onlyquranexpo.vercel.app/api/get-metadata?type=surah-list`

This will help determine if the issue is with the API endpoint itself or with how the client is accessing it.

### 5. Enhanced API Logging

Add more detailed logging to api/get-metadata.ts to better diagnose the issue:

```javascript
module.exports = async function handler(req: typeof VercelRequest, res: typeof VercelResponse) {
  console.log(`[API] Request received: ${req.url}`);
  console.log(`[API] Query parameters: ${JSON.stringify(req.query)}`);
  console.log(`[API] Environment variables available: ${Object.keys(process.env).join(', ')}`);
  
  const { type } = req.query;
  // Rest of the function...
}
```

### 6. Check Database Connection

Verify the database connection is working correctly:

```javascript
try {
  client = await pool.connect();
  console.log("[API] Successfully connected to database");
  
  // Handle different metadata requests
  if (type === 'surah-list') {
    console.log("[API] Executing surah-list query");
    const result = await client.query(
      'SELECT number, arabic_name AS name, transliteration AS tname, ' +
      'english_name AS ename, ayas, revelation_type AS type, chronological_order AS "order", rukus ' +
      'FROM quran_surahs ORDER BY number'
    );
    console.log(`[API] Query returned ${result.rows.length} rows`);
    return res.status(200).json(result.rows);
  }
  // Rest of the function...
}
```

## Implementation Strategy

1. Make the updates to vercel.json first
2. Add enhanced logging to the API endpoint
3. Redeploy the application
4. Test the API endpoint directly
5. Monitor logs in the Vercel dashboard
6. If issues persist, investigate database connectivity

## Expected Outcome

After implementing these changes, the API endpoint should be correctly routed and accessible, returning the expected metadata for the surah list.