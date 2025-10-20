"use client";

import { api } from "@/lib/trpc/client";
import { useErrorHandler } from "@/lib/error-utils";
import { useAppStore } from "@/stores/useAppStore";

// Enhanced tRPC hooks with automatic error handling
export function useTRPCWithError() {
  const { handleError } = useErrorHandler();
  const { showSuccess, setLoading } = useAppStore();

  // Enhanced mutation hook with error handling
  const useMutationWithError = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutation: any,
    options?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess?: (data: any) => void;
      onError?: (error: unknown) => void;
      successMessage?: string;
      loadingKey?: string;
    }
  ) => {
    return mutation.useMutation({
      onMutate: () => {
        if (options?.loadingKey) {
          setLoading(options.loadingKey, true);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (data: any) => {
        if (options?.successMessage) {
          showSuccess("Success", options.successMessage);
        }
        options?.onSuccess?.(data);
      },
      onError: (error: unknown) => {
        handleError(error);
        options?.onError?.(error);
      },
      onSettled: () => {
        if (options?.loadingKey) {
          setLoading(options.loadingKey, false);
        }
      },
    });
  };

  // Enhanced query hook with error handling
  const useQueryWithError = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input?: any,
    options?: {
      onError?: (error: unknown) => void;
      enabled?: boolean;
      loadingKey?: string;
    }
  ) => {
    return query.useQuery(input, {
      enabled: options?.enabled,
      onError: (error: unknown) => {
        handleError(error);
        options?.onError?.(error);
      },
      onSuccess: () => {
        if (options?.loadingKey) {
          setLoading(options.loadingKey, false);
        }
      },
    });
  };

  return {
    useMutationWithError,
    useQueryWithError,
  };
}

// Specific hooks for common operations
export function usePostMutations() {
  const { useMutationWithError } = useTRPCWithError();
  const utils = api.useUtils();

  const createPost = useMutationWithError(api.posts.create, {
    successMessage: "Post created successfully!",
    loadingKey: "create-post",
    onSuccess: () => {
      utils.posts.getAll.invalidate();
    },
  });

  const updatePost = useMutationWithError(api.posts.update, {
    successMessage: "Post updated successfully!",
    loadingKey: "update-post",
    onSuccess: () => {
      utils.posts.getAll.invalidate();
    },
  });

  const deletePost = useMutationWithError(api.posts.delete, {
    successMessage: "Post deleted successfully!",
    loadingKey: "delete-post",
    onSuccess: () => {
      utils.posts.getAll.invalidate();
    },
  });

  const bulkUpdateStatus = useMutationWithError(api.posts.bulkUpdateStatus, {
    successMessage: "Posts updated successfully!",
    loadingKey: "bulk-update",
    onSuccess: () => {
      utils.posts.getAll.invalidate();
    },
  });

  return {
    createPost,
    updatePost,
    deletePost,
    bulkUpdateStatus,
  };
}

export function useCategoryMutations() {
  const { useMutationWithError } = useTRPCWithError();
  const utils = api.useUtils();

  const createCategory = useMutationWithError(api.categories.create, {
    successMessage: "Category created successfully!",
    loadingKey: "create-category",
    onSuccess: () => {
      utils.categories.getAll.invalidate();
    },
  });

  const updateCategory = useMutationWithError(api.categories.update, {
    successMessage: "Category updated successfully!",
    loadingKey: "update-category",
    onSuccess: () => {
      utils.categories.getAll.invalidate();
    },
  });

  const deleteCategory = useMutationWithError(api.categories.delete, {
    successMessage: "Category deleted successfully!",
    loadingKey: "delete-category",
    onSuccess: () => {
      utils.categories.getAll.invalidate();
      utils.posts.getAll.invalidate();
    },
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
