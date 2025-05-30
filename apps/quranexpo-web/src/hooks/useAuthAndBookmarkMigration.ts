import { $authStore, $userStore } from '@clerk/astro/client';
import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'preact/hooks';
import { migrateBookmarksToDatabase } from '../services/bookmarkMigrationService';

export function useAuthAndBookmarkMigration() {
  const auth = useStore($authStore);
  const user = useStore($userStore);
  const hasMigrated = useRef(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');

  useEffect(() => {
    // auth.userId es undefined (loading), null (signed out), o string (signed in)
    if (auth.userId === undefined) return; // Still loading
    
    if (auth.userId && user && !hasMigrated.current) {
      setMigrationStatus('migrating');
      console.log('User is signed in, attempting bookmark migration...');
      
      migrateBookmarksToDatabase(auth.userId)
        .then(() => {
          hasMigrated.current = true;
          setMigrationStatus('success');
          console.log('Bookmark migration completed successfully.');
        })
        .catch(error => {
          setMigrationStatus('error');
          console.error('Error during bookmark migration:', error);
        });
    } else if (auth.userId === null) {
      // User signed out
      hasMigrated.current = false;
      setMigrationStatus('idle');
      console.log('User signed out, resetting migration status.');
    }
  }, [auth.userId, user]);

  return {
    migrationStatus,
    isSignedIn: auth.userId !== null && auth.userId !== undefined,
    userId: auth.userId,
    user
  };
}