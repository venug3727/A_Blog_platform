// Core Blog Types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  readingTime: number;
  wordCount: number;
  metaDescription?: string | null;
  seoKeywords: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  postCount: number;
  createdAt: Date;
}

export interface PostCategory {
  postId: string;
  categoryId: string;
  category?: Category | null;
}

// Extended types for API responses
export interface BlogPostWithCategories extends BlogPost {
  postCategories: PostCategory[];
}

export interface CategoryWithPosts extends Category {
  posts?: BlogPost[];
}

// UI State Types
export interface UIState {
  theme: "light" | "dark";
  viewMode: "cards" | "table";
  sidebarCollapsed: boolean;
  globalLoading: boolean;
  isOnline: boolean;
}

// Form Types
export interface CreatePostInput {
  title: string;
  content: string;
  published?: boolean;
  categoryIds: string[];
  metaDescription?: string;
  seoKeywords?: string[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// Store Types
export interface PostStore {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  setPosts: (posts: BlogPost[]) => void;
  setCurrentPost: (post: BlogPost | null) => void;
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, updates: Partial<BlogPost>) => void;
  removePost: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface CategoryStore {
  categories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  setCategories: (categories: Category[]) => void;
  setCurrentCategory: (category: Category | null) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface AppStore {
  globalLoading: boolean;
  isOnline: boolean;
  notifications: Notification[];
  setGlobalLoading: (loading: boolean) => void;
  setOnlineStatus: (online: boolean) => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

// Notification Types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// AI Integration Types
export interface AIContentSuggestion {
  type: "title" | "meta" | "keywords" | "category";
  suggestions: string[];
  confidence: number;
}

export interface ContentAnalytics {
  postId: string;
  views: number;
  readingTime: number;
  engagementScore: number;
  popularCategories: string[];
}

// Component Props Types
export interface PostCardProps {
  post: BlogPost & {
    postCategories?: PostCategory[];
  };
  showStatus?: boolean;
  showActions?: boolean;
}

export interface PostListProps {
  posts?: BlogPost[];
  showStatus?: boolean;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showPagination?: boolean;
  limit?: number;
}

// Utility Types
export type ViewMode = "cards" | "table";
export type Theme = "light" | "dark";
export type PostStatus = "draft" | "published";
export type SortOrder = "asc" | "desc";
export type SortField = "title" | "createdAt" | "updatedAt" | "publishedAt";

// Filter Types
export interface PostFilters {
  published?: boolean;
  categoryId?: string;
  search?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}

export interface CategoryFilters {
  search?: string;
  sortBy?: "name" | "createdAt" | "postCount";
  sortOrder?: SortOrder;
  limit?: number;
  offset?: number;
}
