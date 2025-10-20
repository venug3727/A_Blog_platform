import { TRPCClientError } from "@trpc/client";
import { useAppStore } from "@/stores/useAppStore";

// Error types for better error handling
export type AppError = {
  message: string;
  code?: string;
  statusCode?: number;
  field?: string;
};

// Extract user-friendly error messages from tRPC errors
export function extractErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    // Handle Zod validation errors
    if (error.data?.zodError) {
      const zodError = error.data.zodError;
      const firstFieldError = Object.values(zodError.fieldErrors)[0];
      if (firstFieldError && Array.isArray(firstFieldError)) {
        return firstFieldError[0] || "Validation error";
      }
      const firstFormError = zodError.formErrors[0];
      if (firstFormError) {
        return firstFormError;
      }
    }

    // Handle other tRPC errors
    return error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

// Extract field-specific errors from tRPC/Zod errors
export function extractFieldErrors(error: unknown): Record<string, string> {
  if (error instanceof TRPCClientError && error.data?.zodError) {
    const zodError = error.data.zodError;
    const fieldErrors: Record<string, string> = {};

    Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[field] = messages[0];
      }
    });

    return fieldErrors;
  }

  return {};
}

// Hook for handling errors with notifications
export function useErrorHandler() {
  const { showError, showWarning } = useAppStore();

  const handleError = (error: unknown, customMessage?: string) => {
    const message = customMessage || extractErrorMessage(error);

    // Determine error type based on error properties
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "BAD_REQUEST") {
        showWarning("Validation Error", message);
      } else if (error.data?.code === "NOT_FOUND") {
        showWarning("Not Found", message);
      } else {
        showError("Error", message);
      }
    } else {
      showError("Error", message);
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error handled:", error);
    }
  };

  return { handleError, extractErrorMessage, extractFieldErrors };
}

// Retry utility for failed operations
export function createRetryHandler(
  operation: () => Promise<void>,
  maxRetries: number = 3,
  delay: number = 1000
) {
  let retryCount = 0;

  const retry = async (): Promise<void> => {
    try {
      await operation();
    } catch (error) {
      retryCount++;

      if (retryCount < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * retryCount));
        return retry();
      } else {
        throw error;
      }
    }
  };

  return retry;
}

// Network error detection
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TRPCClientError) {
    return (
      error.data?.code === "INTERNAL_SERVER_ERROR" ||
      error.message.includes("fetch")
    );
  }

  if (error instanceof Error) {
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("offline")
    );
  }

  return false;
}

// Validation error helpers
export function isValidationError(error: unknown): boolean {
  return (
    error instanceof TRPCClientError &&
    error.data?.code === "BAD_REQUEST" &&
    !!error.data?.zodError
  );
}

// Create user-friendly error messages for common scenarios
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  VALIDATION_ERROR: "Please check your input and try again.",
  NOT_FOUND: "The requested item could not be found.",
  UNAUTHORIZED: "You don't have permission to perform this action.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

export function getErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (isValidationError(error)) {
    return ERROR_MESSAGES.VALIDATION_ERROR;
  }

  if (error instanceof TRPCClientError) {
    switch (error.data?.code) {
      case "NOT_FOUND":
        return ERROR_MESSAGES.NOT_FOUND;
      case "UNAUTHORIZED":
        return ERROR_MESSAGES.UNAUTHORIZED;
      case "INTERNAL_SERVER_ERROR":
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return extractErrorMessage(error);
    }
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}
