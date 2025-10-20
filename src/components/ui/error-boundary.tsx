"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { ResponsiveContainer } from "./responsive-container";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <ResponsiveContainer size="sm">
            <Card className="border-destructive/20">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl">
                  Oops! Something went wrong
                </CardTitle>
                <CardDescription className="text-lg leading-relaxed">
                  We encountered an unexpected error while loading this content.
                  Don&apos;t worry, this has been logged and we&apos;ll look
                  into it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="rounded-lg border bg-muted/50 p-4 text-sm">
                    <summary className="cursor-pointer font-medium text-destructive hover:text-destructive/80">
                      Error Details (Development)
                    </summary>
                    <div className="mt-4 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Error Message:
                        </p>
                        <pre className="text-xs bg-background p-2 rounded border overflow-auto">
                          {this.state.error.message}
                        </pre>
                      </div>
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Component Stack:
                          </p>
                          <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-32">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={this.handleRetry}
                    className="flex-1"
                    size="lg"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="flex-1"
                    size="lg"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  If this problem persists, please refresh the page or contact
                  support.
                </p>
              </CardContent>
            </Card>
          </ResponsiveContainer>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Error caught:", error, errorInfo);

    // In a real app, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error);
    }
  };
}

// Simple error fallback component
export function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800">Error occurred</h3>
          <p className="text-sm text-red-700 mt-1">
            {error.message || "An unexpected error occurred"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetError}
            className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
