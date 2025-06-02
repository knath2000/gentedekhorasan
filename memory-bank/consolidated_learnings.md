## API Development & Integration
**Pattern: Frontend-Backend Parameter Consistency**
- Ensure that parameters sent from the frontend (e.g., in URL queries or request bodies) precisely match what the backend API expects. Mismatches can lead to silent failures or incorrect data handling.
- *Rationale:* Prevents debugging headaches related to data not reaching the backend correctly.

**Pattern: API Response Consistency for CRUD Operations**
- For `PUT` (update) operations, it is often beneficial for the API to return the full updated object rather than just a success message.
- *Rationale:* Simplifies frontend state management, as the frontend can directly use the returned object to update its local store, ensuring consistency and reducing the need for additional `GET` requests.

## Project Specifics
**QuranExpo - Bookmark Notes Functionality:**
- The existing `UserBookmark` model in Prisma already supports a `notes` field.
- The API endpoints for bookmark CRUD operations were largely functional, but required minor adjustments for parameter consistency and response format.
- **Fixes Applied:**
    - Corrected URL parameter in `apps/quranexpo-web/src/services/apiClient.ts` for `updateBookmark` to use `id` instead of `userId` and `bookmarkId`.
    - Modified `apps/quran-data-api/api/v1/user-bookmarks.ts` (PUT method) to return the updated `UserBookmark` object instead of a generic success message.
- *Outcome:* The notes functionality on the bookmarks page is now fully operational, leveraging existing infrastructure with minimal code changes.