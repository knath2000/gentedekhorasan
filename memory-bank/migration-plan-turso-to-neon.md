# Migration Plan: TursoDB to NeonDB for Quran and Bible Data

**Version:** 1.0.0  
**Date:** 2025-05-06  
**Related Brief:** `memory-bank/projectbrief.md`

## 1. Objective

To migrate Quran and Bible data from TursoDB to NeonDB, ensuring all tables are correctly populated with data. This plan addresses the issue of empty tables in NeonDB by creating a systematic process for data extraction, transformation, and loading.

## 2. Background

- **Current State:** Tables in NeonDB are created but empty. No migration script from TursoDB to NeonDB was found in the codebase.
- **Connection Details Provided:** 
  - TursoDB URL: `libsql://quran-turso-db-blackflagkhorasan.aws-us-east-1.turso.io`
  - TursoDB Auth Token: Provided
  - NeonDB URL: `postgres://neondb_owner:npg_aUxt8JWgcL0u@ep-floral-dream-a4mjg8km-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
  - NeonDB Additional Parameters: Provided

## 3. Migration Strategy

The migration will follow an Extract, Transform, Load (ETL) approach:
- **Extract:** Retrieve data from TursoDB using the provided connection details.
- **Transform:** Map data schemas if necessary, ensuring compatibility with NeonDB schema.
- **Load:** Insert the extracted data into NeonDB tables.

## 4. Detailed Steps

### Step 1: Environment Setup
- Create a new directory `scripts/migrate-turso-to-neon/` for the migration script and related files.
- Set up necessary dependencies (`@libsql/client` for TursoDB, `pg` or Prisma for NeonDB) in a `package.json` file.

### Step 2: Schema Analysis
- Identify all tables in TursoDB related to Quran and Bible data.
- Compare with NeonDB schema to ensure compatibility. If discrepancies exist, define transformation rules.

### Step 3: Script Development
- Develop a TypeScript script `index.ts` in the migration directory:
  - Connect to TursoDB using provided URL and auth token.
  - Connect to NeonDB using provided URL.
  - For each table:
    - Extract data in batches to handle large datasets.
    - Transform data if needed.
    - Insert data into corresponding NeonDB tables.
  - Implement error handling for connection issues, data mismatches, and insertion failures.
  - Log progress and errors for debugging.

### Step 4: Validation
- After migration, run validation queries to compare record counts and sample data between TursoDB and NeonDB.
- Ensure data integrity and completeness.

### Step 5: Documentation
- Document the migration process, including any transformation rules or issues encountered, in a README file within the migration directory.

## 5. Tools and Libraries
- **TursoDB Access:** `@libsql/client` for connecting and querying TursoDB.
- **NeonDB Access:** Prisma (already in use in the project) or `pg` for PostgreSQL connections.
- **Environment Management:** `dotenv` to handle connection strings securely.

## 6. Potential Challenges and Mitigations
- **Connection Issues:** Implement retry mechanisms for database connections.
- **Schema Mismatches:** Manually map fields if automatic mapping fails, log discrepancies for review.
- **Large Data Volumes:** Use batch processing to manage memory usage and avoid timeouts.

## 7. Next Actions
- Request a switch to Code mode to implement the migration script as outlined.
- After implementation, test the script in a controlled environment before full migration.

## 8. Success Criteria
- All relevant tables in NeonDB are populated with data matching TursoDB.
- Validation checks confirm data integrity and completeness.
- Migration script is reusable for future migrations if needed.