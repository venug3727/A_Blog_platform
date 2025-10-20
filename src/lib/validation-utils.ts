import { z } from "zod";

// Common validation patterns
export const commonValidations = {
  // String validations
  requiredString: (message = "This field is required") =>
    z.string().min(1, message),

  optionalString: z.string().optional(),

  email: z.string().email("Please enter a valid email address"),

  url: z.string().url("Please enter a valid URL"),

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  // Number validations
  positiveNumber: z.number().positive("Must be a positive number"),

  nonNegativeNumber: z.number().min(0, "Must be zero or positive"),

  // Array validations
  nonEmptyArray: <T>(
    schema: z.ZodType<T>,
    message = "At least one item is required"
  ) => z.array(schema).min(1, message),

  // Date validations
  futureDate: z
    .date()
    .refine((date) => date > new Date(), "Date must be in the future"),

  pastDate: z
    .date()
    .refine((date) => date < new Date(), "Date must be in the past"),
};

// Blog-specific validations
export const blogValidations = {
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .refine(
      (title) => title.trim().length > 0,
      "Title cannot be only whitespace"
    ),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(50000, "Content must be less than 50,000 characters"),

  metaDescription: z
    .string()
    .max(160, "Meta description must be less than 160 characters")
    .optional(),

  categoryName: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .refine(
      (name) => name.trim().length > 0,
      "Category name cannot be only whitespace"
    ),

  seoKeywords: z
    .array(z.string().min(1))
    .max(10, "Maximum 10 keywords allowed")
    .default([]),

  readingTime: z.number().min(0).default(0),

  wordCount: z.number().min(0).default(0),
};

// Form validation helpers
export function createFormSchema<T extends Record<string, z.ZodTypeAny>>(
  fields: T
): z.ZodObject<T> {
  return z.object(fields);
}

// Validation error formatting
export function formatValidationErrors(
  error: z.ZodError
): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  error.issues.forEach((issue: z.ZodIssue) => {
    const path = issue.path.join(".");
    formattedErrors[path] = issue.message;
  });

  return formattedErrors;
}

// Custom validation functions
export const customValidations = {
  // Check if string contains only alphanumeric characters and spaces
  alphanumericWithSpaces: (
    message = "Only letters, numbers, and spaces allowed"
  ) => z.string().regex(/^[a-zA-Z0-9\s]*$/, message),

  // Check if string is a valid hex color
  hexColor: (message = "Must be a valid hex color") =>
    z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, message),

  // Check if array has unique values
  uniqueArray: <T>(
    schema: z.ZodType<T>,
    message = "All items must be unique"
  ) =>
    z.array(schema).refine((arr) => new Set(arr).size === arr.length, message),

  // Check if string matches another field (for password confirmation)
  matchesField: (fieldName: string, message = "Fields must match") =>
    z.string().refine(() => {
      // This would need to be implemented at the schema level with superRefine
      // For now, return true and handle matching at form level
      return true;
    }, message),

  // File size validation (for future file uploads)
  fileSize: (maxSizeInMB: number, message?: string) =>
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= maxSizeInMB * 1024 * 1024,
        message || `File size must be less than ${maxSizeInMB}MB`
      ),

  // File type validation
  fileType: (allowedTypes: string[], message?: string) =>
    z
      .instanceof(File)
      .refine(
        (file) => allowedTypes.includes(file.type),
        message || `File type must be one of: ${allowedTypes.join(", ")}`
      ),
};

// Pre-built schemas for common use cases
export const schemas = {
  createPost: createFormSchema({
    title: blogValidations.title,
    content: blogValidations.content,
    published: z.boolean().default(false),
    categoryIds: z.array(z.string().uuid()).optional(),
    metaDescription: blogValidations.metaDescription,
    seoKeywords: blogValidations.seoKeywords,
  }),

  updatePost: createFormSchema({
    id: z.string().uuid(),
    title: blogValidations.title.optional(),
    content: blogValidations.content.optional(),
    published: z.boolean().optional(),
    categoryIds: z.array(z.string().uuid()).optional(),
    metaDescription: blogValidations.metaDescription,
    seoKeywords: blogValidations.seoKeywords.optional(),
  }),

  createCategory: createFormSchema({
    name: blogValidations.categoryName,
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
  }),

  updateCategory: createFormSchema({
    id: z.string().uuid(),
    name: blogValidations.categoryName.optional(),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
  }),

  searchPosts: createFormSchema({
    query: z.string().min(1, "Search query is required"),
    categoryId: z.string().uuid().optional(),
    published: z.boolean().optional(),
  }),
};

// Validation utilities for runtime checks
export const validationUtils = {
  isValidUUID: (value: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  isValidSlug: (value: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(value);
  },

  isValidEmail: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  sanitizeString: (value: string): string => {
    return value.trim().replace(/\s+/g, " ");
  },

  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },
};
