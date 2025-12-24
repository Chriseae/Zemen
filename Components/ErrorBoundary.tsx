
import React, { ErrorInfo, ReactNode } from 'react';
import { ExclamationIcon, RefreshIcon } from './Icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-200 p-6 text-center">
          <div className="bg-red-500/10 p-4 rounded-full mb-4 text-red-500 border border-red-500/20">
            <ExclamationIcon className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-6 max-w-md">
            We encountered an unexpected error. The application has been paused to prevent data loss.
          </p>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-6 max-w-lg w-full overflow-auto text-left">
             <code className="text-xs text-red-400 font-mono">
               {this.state.error?.toString()}
             </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <RefreshIcon className="w-5 h-5" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
