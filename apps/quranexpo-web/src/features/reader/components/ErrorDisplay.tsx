import type { FunctionalComponent } from 'preact';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorDisplay: FunctionalComponent<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 flex flex-col items-center justify-center text-center max-w-lg mx-auto my-8 shadow-lg">
      <div className="flex items-center mb-3">
        <svg className="h-8 w-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h3 className="font-bold text-lg">Oops! Something went wrong.</h3>
      </div>
      {message && (
        <p className="text-sm italic mb-4">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;