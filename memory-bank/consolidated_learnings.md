## API Development & Integration
**Pattern: Frontend-Backend Parameter Consistency**
- Ensure that parameters sent from the frontend (e.g., in URL queries or request bodies) precisely match what the backend API expects. Mismatches can lead to silent failures or incorrect data handling.
- *Rationale:* Prevents debugging headaches related to data not reaching the backend correctly.

**Pattern: API Response Consistency for CRUD Operations**
- For `PUT` (update) operations, it is often beneficial for the API to return the full updated object rather than just a success message.
- *Rationale:* Simplifies frontend state management, as the frontend can directly use the returned object to update its local store, ensuring consistency and reducing the need for additional `GET` requests.

## Frontend Development & Debugging
**Pattern: Hook Invocation and Hydration Errors**
- `useEffect` and other Hooks must always be called at the top level of a functional component or a custom Hook. Nesting Hooks inside conditional statements, loops, or other functions will lead to runtime errors like "Hook can only be invoked from render methods."
- Hydration errors (`Expected a DOM node of type "div" but found ""`) occur when the server-rendered HTML (SSR) does not exactly match the client-rendered DOM. To resolve this, ensure that the component responsible for rendering (e.g., `ReaderContainer`) handles its own loading states and skeletons, and avoid conditional rendering of entire component trees based on `isClient` flags in wrapper components (e.g., `ClientOnlyReaderContainer`).

**Pattern: Debugging Component Rendering Issues**
- When components fail to render or display data, strategically placed `console.log` statements can be invaluable. Log the state of `loading`, `error`, and data arrays (`verses.length`) just before conditional rendering blocks to pinpoint why content is not being displayed.

## Project Specifics
**QuranExpo - Bookmark Notes Functionality:**
- The existing `UserBookmark` model in Prisma already supports a `notes` field.
- The API endpoints for bookmark CRUD operations were largely functional, but required minor adjustments for parameter consistency and response format.
- **Fixes Applied:**
    - Corrected URL parameter in `apps/quranexpo-web/src/services/apiClient.ts` for `updateBookmark` to use `id` instead of `userId` and `bookmarkId`.
    - Modified `apps/quran-data-api/api/v1/user-bookmarks.ts` (PUT method) to return the updated `UserBookmark` object instead of a generic success message.
- *Outcome:* The notes functionality on the bookmarks page is now fully operational, leveraging existing infrastructure with minimal code changes.

**QuranExpo - AI Translation Feature:**
- **Implementation Details:**
    - Added `showAITranslation` nanostore in `apps/quranexpo-web/src/stores/settingsStore.ts`.
    - Integrated a toggle for AI translation in `apps/quranexpo-web/src/pages/settings.astro`.
    - Created a new API route `apps/quran-data-api/api/v1/ai-translate.ts` to interact with OpenRouter.ai (using `openai/gpt-4o-mini` model).
    - Added `getAITranslation` function in `apps/quranexpo-web/src/services/apiClient.ts`.
    - Modified `apps/quranexpo-web/src/components/ReaderContainer.tsx` to conditionally fetch and pass AI translations to `ReaderVerseCard.tsx`.
    - Updated `apps/quranexpo-web/src/components/ReaderVerseCard.tsx` to display AI translations, including loading and error states.
- **Runtime Fixes:**
    - Corrected `useEffect` placement in `ReaderContainer.tsx` to resolve "Hook can only be invoked from render methods" error.
    - Modified `ClientOnlyReaderContainer.tsx` to directly render `ReaderContainer`, resolving hydration issues.
- **Git Conflict Resolution:**
    - Successfully resolved `git merge` conflicts in `ReaderContainer.tsx`, `ReaderVerseCard.tsx`, and `apiClient.ts` by explicitly staging local versions.
- *Current Status:* Feature implemented, but the verse list is not showing on the reader page, indicating a potential data loading or rendering conditional issue.