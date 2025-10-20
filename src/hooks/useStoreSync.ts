import { useEffect } from "react";
import { api } from "@/lib/trpc/client";
import { usePostStore, useCategoryStore } from "@/stores";

// Hook to sync tRPC data with Zustand stores
export const useStoreSync = () => {
  const { setPosts } = usePostStore();
  const { setCategories } = useCategoryStore();

  // Sync posts data
  const { data: posts } = api.posts.getAll.useQuery({});
  const { data: categories } = api.categories.getAll.useQuery();

  useEffect(() => {
    if (posts) {
      setPosts(posts);
    }
  }, [posts, setPosts]);

  useEffect(() => {
    if (categories) {
      setCategories(categories);
    }
  }, [categories, setCategories]);
};

// Hook for syncing specific post data
export const usePostSync = (postId?: string) => {
  const { setCurrentPost } = usePostStore();

  const { data: post } = api.posts.getById.useQuery(
    { id: postId! },
    { enabled: !!postId }
  );

  useEffect(() => {
    if (post) {
      setCurrentPost(post);
    }
  }, [post, setCurrentPost]);

  return post;
};
