import type { FunctionalComponent } from 'preact';
import { Component } from 'preact';
import { logger } from '../../../utils/logger'; // Importar el logger
import ErrorDisplay from './ErrorDisplay';

interface ErrorBoundaryProps {
  children: preact.ComponentChildren;
  fallback?: FunctionalComponent<{ error: Error | null; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: preact.ErrorInfo) {
    logger.error("Error captured by ErrorBoundary:", { error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, resetError: this.resetError });
      }
      return (
        <ErrorDisplay
          message={this.state.error?.message || "An unexpected error occurred."}
          onRetry={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;