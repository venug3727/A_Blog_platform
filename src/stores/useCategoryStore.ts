import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Category } from "@/server/db/schema";

interface CategoryStore {
  // State
  categories: Category[];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCategories: (categories: Category[]) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;

  // Loading and Error Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility Actions
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoriesWithPostCount: () => (Category & { postCount: number })[];
}

export const useCategoryStore = create<CategoryStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      categories: [],
      selectedCategory: null,
      isLoading: false,
      error: null,

      // Actions
      setCategories: (categories) =>
        set({ categories }, false, "setCategories"),

      setSelectedCategory: (selectedCategory) =>
        set({ selectedCategory }, false, "setSelectedCategory"),

      addCategory: (category) =>
        set(
          (state) => ({
            categories: [...state.categories, category],
          }),
          false,
          "addCategory"
        ),

      updateCategory: (id, updates) =>
        set(
          (state) => ({
            categories: state.categories.map((category) =>
              category.id === id ? { ...category, ...updates } : category
            ),
          }),
          false,
          "updateCategory"
        ),

      removeCategory: (id) =>
        set(
          (state) => ({
            categories: state.categories.filter(
              (category) => category.id !== id
            ),
            selectedCategory:
              state.selectedCategory === id ? null : state.selectedCategory,
          }),
          false,
          "removeCategory"
        ),

      // Loading and Error Actions
      setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

      setError: (error) => set({ error }, false, "setError"),

      // Utility Actions
      getCategoryById: (id) => {
        const state = get();
        return state.categories.find((category) => category.id === id);
      },

      getCategoryBySlug: (slug) => {
        const state = get();
        return state.categories.find((category) => category.slug === slug);
      },

      getCategoriesWithPostCount: () => {
        const state = get();
        // This would typically be enhanced with actual post count data
        // For now, we'll return categories with a default postCount
        return state.categories.map((category) => ({
          ...category,
          postCount: 0, // This should be populated from the actual data
        }));
      },
    }),
    {
      name: "category-store",
    }
  )
);
