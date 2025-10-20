import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { ZodError } from "zod";
import superjson from "superjson";
import { db } from "../db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 */
export const createTRPCContext = (
  opts: CreateNextContextOptions | FetchCreateContextFnOptions
) => {
  return {
    db,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE HELPERS
 *
 * These are helper functions to create routers and procedures.
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;

/**
 * Error handling middleware
 */
export const errorMiddleware = t.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof Error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        cause: error,
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  }
});

/**
 * Protected procedure with error handling
 */
export const protectedProcedure = publicProcedure.use(errorMiddleware);
