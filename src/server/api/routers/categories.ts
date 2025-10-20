import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { categories, postCategories } from "../../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Validation schemas
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
});

// Utility functions
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const categoriesRouter = createTRPCRouter({
  // Get all categories with post counts
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categoriesWithCounts = await ctx.db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        createdAt: categories.createdAt,
        postCount: sql<number>`count(${postCategories.postId})::int`,
      })
      .from(categories)
      .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
      .groupBy(categories.id)
      .orderBy(desc(categories.createdAt));

    return categoriesWithCounts;
  }),

  // Get category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, input.slug),
        with: {
          postCategories: {
            with: {
              post: true,
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  // Get category by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  // Create new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.name);

      // Check if slug already exists
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, slug),
      });

      if (existingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A category with this name already exists",
        });
      }

      const [newCategory] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          slug,
          description: input.description,
        })
        .returning();

      return newCategory;
    }),

  // Update category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const {
        id,
        ...updateData
      }: { id: string } & Partial<{
        name: string;
        description: string;
        slug: string;
      }> = input;

      // Check if category exists
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, id),
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Update slug if name changed
      if (updateData.name && updateData.name !== existingCategory.name) {
        const newSlug = generateSlug(updateData.name);
        const slugExists = await ctx.db.query.categories.findFirst({
          where: eq(categories.slug, newSlug),
        });

        if (slugExists && slugExists.id !== id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A category with this name already exists",
          });
        }

        updateData.slug = newSlug;
      }

      const [updatedCategory] = await ctx.db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, id))
        .returning();

      return updatedCategory;
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Remove category assignments from all related posts (as per requirement 2.3)
      await ctx.db
        .delete(postCategories)
        .where(eq(postCategories.categoryId, input.id));

      // Delete the category
      await ctx.db.delete(categories).where(eq(categories.id, input.id));

      return { success: true };
    }),

  // Get categories with their posts
  getWithPosts: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
        with: {
          postCategories: {
            with: {
              post: {
                with: {
                  postCategories: {
                    with: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  // Get popular categories (by post count)
  getPopular: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(10) }))
    .query(async ({ input, ctx }) => {
      const popularCategories = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          createdAt: categories.createdAt,
          postCount: sql<number>`count(${postCategories.postId})::int`,
        })
        .from(categories)
        .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
        .groupBy(categories.id)
        .orderBy(sql`count(${postCategories.postId}) DESC`)
        .limit(input.limit);

      return popularCategories;
    }),
});
