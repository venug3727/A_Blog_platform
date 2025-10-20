import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getGeminiService } from "@/lib/ai/gemini-service";
import { TRPCError } from "@trpc/server";

export const aiRouter = createTRPCRouter({
  generateTitleSuggestions: publicProcedure
    .input(
      z.object({
        content: z.string().min(10, "Content must be at least 10 characters"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const geminiService = getGeminiService();
        const suggestions = await geminiService.generateTitleSuggestions(
          input.content
        );

        return {
          suggestions,
          success: true,
        };
      } catch (error) {
        console.error("AI title generation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate title suggestions. Please try again.",
        });
      }
    }),

  generateSEOKeywords: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(10, "Content must be at least 10 characters"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const geminiService = getGeminiService();
        const keywords = await geminiService.generateSEOKeywords(
          input.title,
          input.content
        );

        return {
          keywords,
          success: true,
        };
      } catch (error) {
        console.error("AI keyword generation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate SEO keywords. Please try again.",
        });
      }
    }),

  generateMetaDescription: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(10, "Content must be at least 10 characters"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const geminiService = getGeminiService();
        const metaDescription = await geminiService.generateMetaDescription(
          input.title,
          input.content
        );

        return {
          metaDescription,
          success: true,
        };
      } catch (error) {
        console.error("AI meta description generation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate meta description. Please try again.",
        });
      }
    }),

  suggestCategories: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(10, "Content must be at least 10 characters"),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const existingCategories = await ctx.db.query.categories.findMany({
          columns: {
            name: true,
            slug: true,
          },
        });

        const geminiService = getGeminiService();
        const suggestions = await geminiService.suggestCategories(
          input.title,
          input.content,
          existingCategories
        );

        // Find the actual category objects that match the suggestions
        const matchedCategories = existingCategories.filter((cat) =>
          suggestions.some(
            (suggestion) => suggestion.toLowerCase() === cat.name.toLowerCase()
          )
        );

        return {
          suggestions: matchedCategories,
          success: true,
        };
      } catch (error) {
        console.error("AI category suggestion error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to suggest categories. Please try again.",
        });
      }
    }),

  optimizeContent: publicProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(50, "Content must be at least 50 characters for optimization"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const geminiService = getGeminiService();
        const optimization = await geminiService.optimizeContent(input.content);

        return {
          ...optimization,
          success: true,
        };
      } catch (error) {
        console.error("AI content optimization error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to optimize content. Please try again.",
        });
      }
    }),
});
