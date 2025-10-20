// Application Configuration
export const APP_CONFIG = {
  name: "Blog Platform",
  description:
    "A modern blogging platform built with Next.js 15, tRPC, and AI assistance",
  version: "1.0.0",
  author: "Blog Platform Team",

  // URLs
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // AI Configuration
  ai: {
    geminiApiKey: process.env.GOOGLE_GEMINI_API_KEY,
    model: "gemini-1.5-flash",
    maxTokens: 1000,
    temperature: 0.7,
  },

  // Content Configuration
  content: {
    maxPostLength: 50000,
    maxTitleLength: 255,
    maxMetaDescriptionLength: 160,
    maxCategoriesPerPost: 10,
    postsPerPage: 12,
    categoriesPerPage: 20,
    readingWordsPerMinute: 200,
  },

  // UI Configuration
  ui: {
    defaultTheme: "light" as const,
    defaultViewMode: "cards" as const,
    animationDuration: 300,
    debounceDelay: 500,
  },

  // Feature Flags
  features: {
    aiAssistance: true,
    darkMode: true,
    offlineSupport: true,
    analytics: false,
    comments: false,
    socialSharing: true,
  },

  // SEO Configuration
  seo: {
    defaultTitle: "Blog Platform - Modern Blogging Made Simple",
    titleTemplate: "%s | Blog Platform",
    defaultDescription:
      "Create, share, and discover amazing content with our AI-powered blogging platform",
    keywords: ["blog", "writing", "content", "AI", "Next.js", "TypeScript"],
    ogImage: "/og-image.png",
    twitterHandle: "@blogplatform",
  },

  // Error Handling
  errors: {
    showStackTrace: process.env.NODE_ENV === "development",
    logToConsole: process.env.NODE_ENV === "development",
    enableErrorReporting: process.env.NODE_ENV === "production",
  },

  // Performance
  performance: {
    enableOptimisticUpdates: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    retryAttempts: 3,
    retryDelay: 1000,
  },
} as const;

// Type-safe environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
  DATABASE_URL: process.env.DATABASE_URL!,
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const;

// Validation for required environment variables
export function validateEnvironment() {
  const required = ["DATABASE_URL"] as const;
  const missing = required.filter((key) => !ENV[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Helper functions
export const isDevelopment = ENV.NODE_ENV === "development";
export const isProduction = ENV.NODE_ENV === "production";
export const isTest = ENV.NODE_ENV === "test";

// Export types
export type AppConfig = typeof APP_CONFIG;
export type FeatureFlags = typeof APP_CONFIG.features;
export type UIConfig = typeof APP_CONFIG.ui;
