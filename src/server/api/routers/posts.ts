import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { posts, postCategories, categories } from "../../db/schema";
import { eq, desc, and, or, ilike, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Validation schemas
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string().uuid()).optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
});

export const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(10).optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
});

// Utility functions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function countWords(content: string): number {
  return content.split(/\s+/).length;
}

export const postsRouter = createTRPCRouter({
  // Get all posts with filtering and pagination
  getAll: publicProcedure
    .input(
      z.object({
        published: z.boolean().optional(),
        categoryId: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const conditions = [];

      if (input.published !== undefined) {
        conditions.push(eq(posts.published, input.published));
      }

      if (input.search) {
        conditions.push(
          or(
            ilike(posts.title, `%${input.search}%`),
            ilike(posts.content, `%${input.search}%`)
          )
        );
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      let postsQuery = await ctx.db.query.posts.findMany({
        where: whereClause,
        limit: input.limit,
        offset: input.offset,
        orderBy: desc(posts.createdAt),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      // Filter by category if specified (requirement 2.5)
      if (input.categoryId) {
        postsQuery = postsQuery.filter((post) =>
          post.postCategories.some((pc) => pc.category?.id === input.categoryId)
        );
      }

      return postsQuery;
    }),

  // Get post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, input.slug),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  // Get post by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  // Create new post
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.title);
      const readingTime = calculateReadingTime(input.content);
      const wordCount = countWords(input.content);

      // Check if slug already exists
      const existingPost = await ctx.db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });

      if (existingPost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A post with this title already exists",
        });
      }

      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          slug,
          published: input.published,
          publishedAt: input.published ? new Date() : null,
          readingTime,
          wordCount,
          metaDescription: input.metaDescription,
          seoKeywords: input.seoKeywords,
        })
        .returning();

      // Add category relationships if provided
      if (input.categoryIds && input.categoryIds.length > 0) {
        const categoryData = input.categoryIds.map((categoryId) => ({
          postId: newPost.id,
          categoryId,
        }));

        await ctx.db.insert(postCategories).values(categoryData);
      }

      return newPost;
    }),

  // Update post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        id,
        categoryIds,
        ...updateData
      }: {
        id: string;
        categoryIds?: string[];
      } & Partial<{
        title: string;
        content: string;
        published: boolean;
        metaDescription: string;
        seoKeywords: string[];
        slug: string;
        readingTime: number;
        wordCount: number;
        publishedAt: Date;
      }> = input;

      // Check if post exists
      const existingPost = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      // Update slug if title changed
      if (updateData.title && updateData.title !== existingPost.title) {
        const newSlug = generateSlug(updateData.title);
        const slugExists = await ctx.db.query.posts.findFirst({
          where: and(eq(posts.slug, newSlug), eq(posts.id, id)),
        });

        if (slugExists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A post with this title already exists",
          });
        }

        updateData.slug = newSlug;
      }

      // Update reading time and word count if content changed
      if (updateData.content) {
        updateData.readingTime = calculateReadingTime(updateData.content);
        updateData.wordCount = countWords(updateData.content);
      }

      // Set published date if publishing for the first time
      if (updateData.published && !existingPost.published) {
        updateData.publishedAt = new Date();
      }

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      // Update category relationships if provided
      if (categoryIds !== undefined) {
        // Remove existing relationships
        await ctx.db
          .delete(postCategories)
          .where(eq(postCategories.postId, id));

        // Add new relationships
        if (categoryIds.length > 0) {
          const categoryData = categoryIds.map((categoryId) => ({
            postId: id,
            categoryId,
          }));

          await ctx.db.insert(postCategories).values(categoryData);
        }
      }

      return updatedPost;
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const existingPost = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      await ctx.db.delete(posts).where(eq(posts.id, input.id));

      return { success: true };
    }),

  // Toggle publish status
  togglePublish: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const existingPost = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const newPublishedStatus = !existingPost.published;
      const updateData: {
        published: boolean;
        updatedAt: Date;
        publishedAt?: Date;
      } = {
        published: newPublishedStatus,
        updatedAt: new Date(),
      };

      // Set published date if publishing for the first time
      if (newPublishedStatus && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }

      const [updatedPost] = await ctx.db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, input.id))
        .returning();

      return updatedPost;
    }),

  // Get posts by category slug (for category pages)
  getByCategory: publicProcedure
    .input(
      z.object({
        categorySlug: z.string(),
        published: z.boolean().default(true),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      // First find the category
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, input.categorySlug),
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Get posts for this category
      const conditions = [];
      if (input.published !== undefined) {
        conditions.push(eq(posts.published, input.published));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const postsQuery = await ctx.db.query.posts.findMany({
        where: whereClause,
        limit: input.limit,
        offset: input.offset,
        orderBy: desc(posts.createdAt),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      // Filter posts that belong to this category
      const filteredPosts = postsQuery.filter((post) =>
        post.postCategories.some((pc) => pc.category?.id === category.id)
      );

      return {
        posts: filteredPosts,
        category,
      };
    }),

  // Bulk operations for posts
  bulkUpdateStatus: publicProcedure
    .input(
      z.object({
        postIds: z.array(z.string().uuid()),
        published: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updateData: {
        published: boolean;
        updatedAt: Date;
        publishedAt?: Date;
      } = {
        published: input.published,
        updatedAt: new Date(),
      };

      // Set published date if publishing
      if (input.published) {
        updateData.publishedAt = new Date();
      }

      await ctx.db
        .update(posts)
        .set(updateData)
        .where(inArray(posts.id, input.postIds));

      return { success: true, updatedCount: input.postIds.length };
    }),

  bulkDelete: publicProcedure
    .input(z.object({ postIds: z.array(z.string().uuid()) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(posts).where(inArray(posts.id, input.postIds));

      return { success: true, deletedCount: input.postIds.length };
    }),

  bulkAssignCategories: publicProcedure
    .input(
      z.object({
        postIds: z.array(z.string().uuid()),
        categoryIds: z.array(z.string().uuid()),
        replace: z.boolean().default(false), // If true, replace existing categories; if false, add to existing
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.replace) {
        // Remove existing categories for these posts
        await ctx.db
          .delete(postCategories)
          .where(inArray(postCategories.postId, input.postIds));
      }

      // Add new categories
      const insertData = input.postIds.flatMap((postId) =>
        input.categoryIds.map((categoryId) => ({ postId, categoryId }))
      );

      if (insertData.length > 0) {
        await ctx.db.insert(postCategories).values(insertData);
      }

      return { success: true, updatedCount: input.postIds.length };
    }),
});
