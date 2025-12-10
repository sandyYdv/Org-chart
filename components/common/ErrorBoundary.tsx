"use client";

import React, { ReactNode, ReactElement } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React component errors
 * Provides graceful error handling and user-friendly error messages
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-full items-center justify-center bg-white p-6">
            <div className="max-w-md text-center">
              <h2 className="text-lg font-semibold text-[#111827] mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-[#6B7280] mb-4">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-[#6366F1] text-white text-sm font-medium hover:bg-[#4F46E5]"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
