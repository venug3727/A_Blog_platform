import { z } from "zod";
import { schemas } from "./validation-utils";

// Re-export schemas from validation-utils for backward compatibility
export const createPostSchema = schemas.createPost;
export const updatePostSchema = schemas.updatePost;
export const createCategorySchema = schemas.createCategory;
export const updateCategorySchema = schemas.updateCategory;

// Search and filter schemas
export const postFilterSchema = z.object({
  published: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  search: z.string().optional(),
});

// Bulk operation schemas
export const bulkUpdateStatusSchema = z.object({
  postIds: z.array(z.string().uuid()),
  published: z.boolean(),
});

export const bulkDeleteSchema = z.object({
  postIds: z.array(z.string().uuid()),
});

export const bulkAssignCategoriesSchema = z.object({
  postIds: z.array(z.string().uuid()),
  categoryIds: z.array(z.string().uuid()),
  replace: z.boolean().default(false),
});

// Response types for API queries
export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date | null;
  postCount: number;
};

export type PostWithCategories = {
  id: string;
  title: string;
  content: string;
  slug: string;
  published: boolean | null;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  readingTime: number | null;
  wordCount: number | null;
  metaDescription: string | null;
  seoKeywords: string[] | null;
  postCategories: Array<{
    postId: string | null;
    categoryId: string | null;
    category: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      createdAt: Date | null;
    } | null;
  }>;
};

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type PostFilterInput = z.infer<typeof postFilterSchema>;
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
export type BulkAssignCategoriesInput = z.infer<
  typeof bulkAssignCategoriesSchema
>;
