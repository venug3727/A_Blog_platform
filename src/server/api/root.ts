import { createTRPCRouter } from "./trpc";
import { postsRouter } from "./routers/posts";
import { categoriesRouter } from "./routers/categories";
import { aiRouter } from "./routers/ai";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  categories: categoriesRouter,
  ai: aiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
