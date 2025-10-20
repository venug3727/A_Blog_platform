import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { BlogPost } from "@/server/db/schema";

export interface PostFilters {
  search?: string;
  categoryId?: string;
  published?: boolean;
  limit?: number;
  offset?: number;
}

interface PostStore {
  // State
  posts: BlogPost[];
  currentPost: BlogPost | null;
  selectedPosts: string[];
  filters: PostFilters;
  isLoading: boolean;
  error: string | null;

  // Post Actions
  setPosts: (posts: BlogPost[]) => void;
  setCurrentPost: (post: BlogPost | null) => void;
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, updates: Partial<BlogPost>) => void;
  removePost: (id: string) => void;

  // Selection Actions
  setSelectedPosts: (postIds: string[]) => void;
  togglePostSelection: (postId: string) => void;
  selectAllPosts: (postIds: string[]) => void;
  clearSelection: () => void;

  // Filter Actions
  setFilters: (filters: Partial<PostFilters>) => void;
  clearFilters: () => void;

  // Loading and Error Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Optimistic Updates
  optimisticUpdatePost: (id: string, updates: Partial<BlogPost>) => void;
  revertOptimisticUpdate: (id: string, originalPost: BlogPost) => void;
}

export const usePostStore = create<PostStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        posts: [],
        currentPost: null,
        selectedPosts: [],
        filters: {
          limit: 20,
          offset: 0,
        },
        isLoading: false,
        error: null,

        // Post Actions
        setPosts: (posts) => set({ posts }, false, "setPosts"),

        setCurrentPost: (post) =>
          set({ currentPost: post }, false, "setCurrentPost"),

        addPost: (post) =>
          set(
            (state) => ({
              posts: [post, ...state.posts],
            }),
            false,
            "addPost"
          ),

        updatePost: (id, updates) =>
          set(
            (state) => ({
              posts: state.posts.map((post) =>
                post.id === id ? { ...post, ...updates } : post
              ),
              currentPost:
                state.currentPost?.id === id
                  ? { ...state.currentPost, ...updates }
                  : state.currentPost,
            }),
            false,
            "updatePost"
          ),

        removePost: (id) =>
          set(
            (state) => ({
              posts: state.posts.filter((post) => post.id !== id),
              currentPost:
                state.currentPost?.id === id ? null : state.currentPost,
              selectedPosts: state.selectedPosts.filter(
                (postId) => postId !== id
              ),
            }),
            false,
            "removePost"
          ),

        // Selection Actions
        setSelectedPosts: (postIds) =>
          set({ selectedPosts: postIds }, false, "setSelectedPosts"),

        togglePostSelection: (postId) =>
          set(
            (state) => ({
              selectedPosts: state.selectedPosts.includes(postId)
                ? state.selectedPosts.filter((id) => id !== postId)
                : [...state.selectedPosts, postId],
            }),
            false,
            "togglePostSelection"
          ),

        selectAllPosts: (postIds) =>
          set({ selectedPosts: postIds }, false, "selectAllPosts"),

        clearSelection: () =>
          set({ selectedPosts: [] }, false, "clearSelection"),

        // Filter Actions
        setFilters: (newFilters) =>
          set(
            (state) => ({
              filters: { ...state.filters, ...newFilters },
            }),
            false,
            "setFilters"
          ),

        clearFilters: () =>
          set(
            {
              filters: {
                limit: 20,
                offset: 0,
              },
            },
            false,
            "clearFilters"
          ),

        // Loading and Error Actions
        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"),

        // Optimistic Updates
        optimisticUpdatePost: (id, updates) =>
          set(
            (state) => ({
              posts: state.posts.map((post) =>
                post.id === id ? { ...post, ...updates } : post
              ),
            }),
            false,
            "optimisticUpdatePost"
          ),

        revertOptimisticUpdate: (id, originalPost) =>
          set(
            (state) => ({
              posts: state.posts.map((post) =>
                post.id === id ? originalPost : post
              ),
            }),
            false,
            "revertOptimisticUpdate"
          ),
      }),
      {
        name: "post-store",
        // Only persist filters and selectedPosts, not the actual posts data
        partialize: (state) => ({
          filters: state.filters,
          selectedPosts: state.selectedPosts,
        }),
      }
    ),
    {
      name: "post-store",
    }
  )
);
