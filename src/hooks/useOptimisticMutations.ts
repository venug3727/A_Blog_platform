import { api } from "@/lib/trpc/client";
import { usePostStore, useAppStore, useCategoryStore } from "@/stores";
import type { BlogPost, Category } from "@/server/db/schema";

// Custom hook for optimistic post updates
export const useOptimisticPostUpdate = () => {
  const { updatePost, optimisticUpdatePost } = usePostStore();
  const { showSuccess, showError } = useAppStore();
  const utils = api.useUtils();

  return api.posts.update.useMutation({
    onMutate: async (variables) => {
      // Optimistically update the store
      optimisticUpdatePost(variables.id, variables);
      return { variables };
    },

    onError: (error) => {
      showError("Update Failed", error.message);
    },

    onSuccess: (data, variables) => {
      // Update store with server response
      updatePost(variables.id, data);
      showSuccess("Post Updated", "Your post has been updated successfully.");
    },

    onSettled: () => {
      // Always refetch after error or success
      utils.posts.getAll.invalidate();
    },
  });
};

// Custom hook for optimistic post creation
export const useOptimisticPostCreate = () => {
  const { addPost } = usePostStore();
  const { showSuccess, showError } = useAppStore();
  const utils = api.useUtils();

  return api.posts.create.useMutation({
    onMutate: async (variables) => {
      // Create optimistic post
      const optimisticPost: BlogPost = {
        id: `temp-${Date.now()}`,
        title: variables.title,
        content: variables.content,
        slug: variables.title.toLowerCase().replace(/\s+/g, "-"),
        published: variables.published || false,
        publishedAt: variables.published ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        readingTime: Math.ceil(variables.content.split(" ").length / 200),
        wordCount: variables.content.split(" ").length,
        metaDescription: variables.metaDescription || null,
        seoKeywords: variables.seoKeywords || [],
        scheduledFor: null,
        postCategories: [],
      };

      // Add to store optimistically
      addPost(optimisticPost);

      return { optimisticPost };
    },

    onError: (error, variables, context) => {
      // Remove optimistic post from store
      if (context?.optimisticPost) {
        const { removePost } = usePostStore.getState();
        removePost(context.optimisticPost.id);
      }

      showError("Creation Failed", error.message);
    },

    onSuccess: (data, variables, context) => {
      // Remove optimistic post and add real post
      if (context?.optimisticPost) {
        const { removePost, addPost } = usePostStore.getState();
        removePost(context.optimisticPost.id);
        // Add postCategories to match the BlogPost type
        const postWithCategories: BlogPost = {
          ...data,
          postCategories: [],
        };
        addPost(postWithCategories);
      }

      showSuccess("Post Created", "Your post has been created successfully.");
    },

    onSettled: () => {
      utils.posts.getAll.invalidate();
    },
  });
};

// Custom hook for optimistic post deletion
export const useOptimisticPostDelete = () => {
  const { removePost } = usePostStore();
  const { showSuccess, showError } = useAppStore();
  const utils = api.useUtils();

  return api.posts.delete.useMutation({
    onMutate: async (variables) => {
      // Optimistically remove from store
      removePost(variables.id);

      return { variables };
    },

    onError: (error) => {
      showError("Deletion Failed", error.message);
    },

    onSuccess: () => {
      showSuccess("Post Deleted", "The post has been deleted successfully.");
    },

    onSettled: () => {
      utils.posts.getAll.invalidate();
    },
  });
};

// Custom hook for optimistic bulk operations
export const useOptimisticBulkOperations = () => {
  const { updatePost, removePost, clearSelection } = usePostStore();
  const { showSuccess, showError } = useAppStore();
  const utils = api.useUtils();

  const bulkUpdateStatus = api.posts.bulkUpdateStatus.useMutation({
    onMutate: async (variables) => {
      // Optimistically update posts in store
      variables.postIds.forEach((postId) => {
        updatePost(postId, { published: variables.published });
      });

      return { variables };
    },

    onError: (error) => {
      showError("Bulk Update Failed", error.message);
    },

    onSuccess: (data, variables) => {
      clearSelection();
      const action = variables.published ? "published" : "unpublished";
      showSuccess(
        "Bulk Update Complete",
        `${variables.postIds.length} posts have been ${action}.`
      );
    },

    onSettled: () => {
      utils.posts.getAll.invalidate();
    },
  });

  const bulkDelete = api.posts.bulkDelete.useMutation({
    onMutate: async (variables) => {
      // Optimistically remove posts from store
      variables.postIds.forEach((postId) => {
        removePost(postId);
      });

      return { variables };
    },

    onError: (error) => {
      showError("Bulk Delete Failed", error.message);
    },

    onSuccess: (data, variables) => {
      clearSelection();
      showSuccess(
        "Bulk Delete Complete",
        `${variables.postIds.length} posts have been deleted.`
      );
    },

    onSettled: () => {
      utils.posts.getAll.invalidate();
    },
  });

  return {
    bulkUpdateStatus,
    bulkDelete,
  };
};

// Custom hook for category operations
export const useOptimisticCategoryOperations = () => {
  const { addCategory, removeCategory } = useCategoryStore();
  const { showSuccess, showError } = useAppStore();
  const utils = api.useUtils();

  const createCategory = api.categories.create.useMutation({
    onMutate: async (variables) => {
      const optimisticCategory: Category = {
        id: `temp-${Date.now()}`,
        name: variables.name,
        slug: variables.name.toLowerCase().replace(/\s+/g, "-"),
        description: variables.description || null,
        createdAt: new Date(),
        postCount: 0,
      };

      addCategory(optimisticCategory);

      return { optimisticCategory };
    },

    onError: (error, variables, context) => {
      if (context?.optimisticCategory) {
        removeCategory(context.optimisticCategory.id);
      }

      showError("Category Creation Failed", error.message);
    },

    onSuccess: (data, variables, context) => {
      if (context?.optimisticCategory) {
        removeCategory(context.optimisticCategory.id);
        // Add postCount to match the Category type
        const categoryWithCount: Category = {
          ...data,
          postCount: 0,
        };
        addCategory(categoryWithCount);
      }

      showSuccess(
        "Category Created",
        "The category has been created successfully."
      );
    },

    onSettled: () => {
      utils.categories.getAll.invalidate();
    },
  });

  return {
    createCategory,
  };
};
