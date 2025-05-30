import { useAuthAndBookmarkMigration } from '../hooks/useAuthAndBookmarkMigration';

interface AuthClientWrapperProps {
  children: preact.ComponentChildren;
}

export default function AuthClientWrapper({ children }: AuthClientWrapperProps) {
  const { migrationStatus } = useAuthAndBookmarkMigration();
  
  return (
    <>
      {/* Indicador de migración opcional */}
      {migrationStatus === 'migrating' && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Sincronizando bookmarks...
        </div>
      )}
      {migrationStatus === 'error' && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Error al sincronizar bookmarks
        </div>
      )}
      {children}
    </>
  );
}