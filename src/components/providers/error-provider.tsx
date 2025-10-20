"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useAppStore } from "@/stores/useAppStore";
import { extractErrorMessage } from "@/lib/error-utils";

interface ErrorContextType {
  reportError: (error: Error, context?: string) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within ErrorProvider");
  }
  return context;
}

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const { showError } = useAppStore();

  const reportError = useCallback(
    (error: Error, context?: string) => {
      const message = extractErrorMessage(error);
      const title = context ? `Error in ${context}` : "Application Error";

      showError(title, message);

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.error(`[${title}]:`, error);
      }

      // In production, you might want to send to error reporting service
      // Example: Sentry.captureException(error, { tags: { context } });
    },
    [showError]
  );

  // Global error handlers
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportError(
        new Error(event.reason?.message || "Unhandled promise rejection"),
        "Promise Rejection"
      );
    };

    // Handle global JavaScript errors
    const handleError = (event: ErrorEvent) => {
      reportError(
        new Error(event.message || "Global JavaScript error"),
        "Global Error"
      );
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, [reportError]);

  const contextValue: ErrorContextType = {
    reportError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      <ErrorBoundary
        onError={(error) => {
          reportError(error, "React Error Boundary");
        }}
      >
        {children}
      </ErrorBoundary>
    </ErrorContext.Provider>
  );
}
