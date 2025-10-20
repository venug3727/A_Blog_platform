"use client";

import { useAppStore } from "@/stores/useAppStore";
import { useCallback } from "react";

export function useLoadingState() {
  const {
    setLoading,
    isLoading,
    setGlobalLoading,
    globalLoading,
    clearAllLoading,
  } = useAppStore();

  // Wrapper for async operations with loading state
  const withLoading = useCallback(
    async <T>(operation: () => Promise<T>, loadingKey?: string): Promise<T> => {
      try {
        if (loadingKey) {
          setLoading(loadingKey, true);
        } else {
          setGlobalLoading(true);
        }

        const result = await operation();
        return result;
      } finally {
        if (loadingKey) {
          setLoading(loadingKey, false);
        } else {
          setGlobalLoading(false);
        }
      }
    },
    [setLoading, setGlobalLoading]
  );

  // Multiple loading states manager
  const withMultipleLoading = useCallback(
    async <T>(
      operation: () => Promise<T>,
      loadingKeys: string[]
    ): Promise<T> => {
      try {
        loadingKeys.forEach((key) => setLoading(key, true));
        const result = await operation();
        return result;
      } finally {
        loadingKeys.forEach((key) => setLoading(key, false));
      }
    },
    [setLoading]
  );

  // Check if any of the specified keys are loading
  const isAnyLoading = useCallback(
    (keys: string[]): boolean => {
      return keys.some((key) => isLoading(key));
    },
    [isLoading]
  );

  // Check if all of the specified keys are loading
  const areAllLoading = useCallback(
    (keys: string[]): boolean => {
      return keys.every((key) => isLoading(key));
    },
    [isLoading]
  );

  return {
    // Basic loading state
    setLoading,
    isLoading,
    setGlobalLoading,
    globalLoading,
    clearAllLoading,

    // Enhanced loading utilities
    withLoading,
    withMultipleLoading,
    isAnyLoading,
    areAllLoading,
  };
}

// Hook for component-specific loading states
export function useComponentLoading(componentName: string) {
  const { withLoading, isLoading, setLoading } = useLoadingState();

  const withComponentLoading = useCallback(
    <T>(operation: () => Promise<T>) => {
      return withLoading(operation, componentName);
    },
    [withLoading, componentName]
  );

  const isComponentLoading = useCallback(
    () => isLoading(componentName),
    [isLoading, componentName]
  );

  const setComponentLoading = useCallback(
    (loading: boolean) => setLoading(componentName, loading),
    [setLoading, componentName]
  );

  return {
    withComponentLoading,
    isComponentLoading,
    setComponentLoading,
  };
}
