import type { FunctionalComponent } from 'preact';
import { forwardRef } from 'preact/compat';
import ErrorBoundary from './ErrorBoundary';
import { ReaderVerseCard } from './ReaderVerseCard';

interface ReaderVerseCardErrorBoundaryProps {
  verse: any;
  showTranslation: boolean;
  isActiveAudio: boolean;
  isPlayingAudio: boolean;
  isLoadingAudio: boolean;
  audioError: string | null;
  onAudioPress: () => void;
  currentTime: number;
  duration: number;
  onSeek: (event: Event) => void;
  className: string;
}

const ReaderVerseCardErrorBoundary = forwardRef<HTMLDivElement, ReaderVerseCardErrorBoundaryProps>((props, ref) => {
  const FallbackComponent: FunctionalComponent<{ error: Error | null; resetError: () => void }> = ({ error, resetError }) => (
    <div className="bg-red-800 text-white p-4 rounded-lg my-4">
      <p>Error loading verse: {error?.message}</p>
      <button onClick={resetError} className="mt-2 text-sm text-blue-300 underline">Try again</button>
    </div>
  );

  return (
    <ErrorBoundary fallback={FallbackComponent}>
      <ReaderVerseCard ref={ref} {...props} />
    </ErrorBoundary>
  );
});

export default ReaderVerseCardErrorBoundary;