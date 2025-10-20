// Application Constants

// Route Constants
export const ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  CATEGORIES: "/categories",
  DASHBOARD: "/dashboard",
  NEW_POST: "/dashboard/new",
  EDIT_POST: (id: string) => `/dashboard/edit/${id}`,
  POST: (slug: string) => `/blog/${slug}`,
  CATEGORY: (slug: string) => `/categories/${slug}`,
} as const;

// API Constants
export const API_ENDPOINTS = {
  POSTS: "/api/trpc/posts",
  CATEGORIES: "/api/trpc/categories",
  AI: "/api/trpc/ai",
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,

  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  DEBOUNCE_DELAY: {
    SEARCH: 300,
    AUTOSAVE: 1000,
    RESIZE: 100,
  },

  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },
} as const;

// Content Constants
export const CONTENT_LIMITS = {
  POST_TITLE_MIN: 1,
  POST_TITLE_MAX: 255,
  POST_CONTENT_MIN: 10,
  POST_CONTENT_MAX: 50000,
  META_DESCRIPTION_MAX: 160,
  CATEGORY_NAME_MIN: 1,
  CATEGORY_NAME_MAX: 100,
  CATEGORY_DESCRIPTION_MAX: 500,
  SEO_KEYWORDS_MAX: 20,
  CATEGORIES_PER_POST_MAX: 10,
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  POSTS_PER_PAGE: {
    MOBILE: 6,
    TABLET: 9,
    DESKTOP: 12,
  },
  CATEGORIES_PER_PAGE: 20,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again.",
  NETWORK: "Network error. Please check your connection and try again.",
  NOT_FOUND: "The requested resource was not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  VALIDATION: "Please check your input and try again.",
  SERVER: "Server error. Please try again later.",

  POST: {
    NOT_FOUND: "Post not found.",
    TITLE_REQUIRED: "Post title is required.",
    TITLE_TOO_LONG: `Post title must be less than ${CONTENT_LIMITS.POST_TITLE_MAX} characters.`,
    CONTENT_REQUIRED: "Post content is required.",
    CONTENT_TOO_SHORT: `Post content must be at least ${CONTENT_LIMITS.POST_CONTENT_MIN} characters.`,
    CONTENT_TOO_LONG: `Post content must be less than ${CONTENT_LIMITS.POST_CONTENT_MAX} characters.`,
    CATEGORY_REQUIRED: "At least one category is required.",
  },

  CATEGORY: {
    NOT_FOUND: "Category not found.",
    NAME_REQUIRED: "Category name is required.",
    NAME_TOO_LONG: `Category name must be less than ${CONTENT_LIMITS.CATEGORY_NAME_MAX} characters.`,
    ALREADY_EXISTS: "A category with this name already exists.",
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  POST: {
    CREATED: "Post created successfully!",
    UPDATED: "Post updated successfully!",
    DELETED: "Post deleted successfully!",
    PUBLISHED: "Post published successfully!",
    UNPUBLISHED: "Post unpublished successfully!",
  },

  CATEGORY: {
    CREATED: "Category created successfully!",
    UPDATED: "Category updated successfully!",
    DELETED: "Category deleted successfully!",
  },

  GENERIC: {
    SAVED: "Changes saved successfully!",
    COPIED: "Copied to clipboard!",
    LOADING: "Loading...",
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: "blog-platform-theme",
  VIEW_MODE: "blog-platform-view-mode",
  SIDEBAR_COLLAPSED: "blog-platform-sidebar-collapsed",
  DRAFT_PREFIX: "blog-platform-draft-",
  USER_PREFERENCES: "blog-platform-preferences",
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  POSTS: {
    ALL: ["posts"] as const,
    LISTS: () => [...QUERY_KEYS.POSTS.ALL, "list"] as const,
    LIST: (filters: Record<string, unknown>) =>
      [...QUERY_KEYS.POSTS.LISTS(), filters] as const,
    DETAILS: () => [...QUERY_KEYS.POSTS.ALL, "detail"] as const,
    DETAIL: (slug: string) => [...QUERY_KEYS.POSTS.DETAILS(), slug] as const,
  },

  CATEGORIES: {
    ALL: ["categories"] as const,
    LISTS: () => [...QUERY_KEYS.CATEGORIES.ALL, "list"] as const,
    LIST: (filters: Record<string, unknown>) =>
      [...QUERY_KEYS.CATEGORIES.LISTS(), filters] as const,
    DETAILS: () => [...QUERY_KEYS.CATEGORIES.ALL, "detail"] as const,
    DETAIL: (slug: string) =>
      [...QUERY_KEYS.CATEGORIES.DETAILS(), slug] as const,
  },

  AI: {
    ALL: ["ai"] as const,
    SUGGESTIONS: (type: string, content: string) =>
      [...QUERY_KEYS.AI.ALL, "suggestions", type, content] as const,
  },
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  MARKDOWN_HEADING: /^#{1,6}\s+.+$/gm,
  MARKDOWN_LINK: /\[([^\]]+)\]\(([^)]+)\)/g,
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
} as const;

// SEO Constants
export const SEO = {
  DEFAULT_TITLE: "Blog Platform",
  TITLE_SEPARATOR: " | ",
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 160,
  DEFAULT_OG_IMAGE: "/og-image.png",
} as const;

// Social Media
export const SOCIAL_MEDIA = {
  TWITTER: {
    HANDLE: "@blogplatform",
    SHARE_URL: (text: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(url)}`,
  },
  FACEBOOK: {
    SHARE_URL: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  LINKEDIN: {
    SHARE_URL: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
  },
} as const;

// Export types
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
export type SuccessMessage =
  (typeof SUCCESS_MESSAGES)[keyof typeof SUCCESS_MESSAGES];
