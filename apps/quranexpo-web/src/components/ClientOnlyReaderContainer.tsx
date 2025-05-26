import { useIsClient } from '../hooks/useIsClient';
import ReaderContainer from './ReaderContainer';

interface ClientOnlyReaderContainerProps {
  surahId: number;
}

const ClientOnlyReaderContainer = ({ surahId }: ClientOnlyReaderContainerProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    // Render skeleton/loading durante SSR
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <ReaderContainer surahId={surahId} />;
};

export default ClientOnlyReaderContainer;