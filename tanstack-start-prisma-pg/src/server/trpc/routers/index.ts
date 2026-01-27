/**
 * Root App Router
 *
 * This is the main router that merges all domain routers.
 * All routers should be imported and merged here.
 */

import { createTRPCRouter } from "../init";
import { helloRouter } from "./hello.router";
import { todoRouter } from "./todo.router";

/**
 * Main application router.
 * Merges all domain routers into a single router.
 */
export const appRouter = createTRPCRouter({
  hello: helloRouter,
  todo: todoRouter,
});

/**
 * Type alias for the app router.
 * Used for client-side type inference.
 */
export type AppRouter = typeof appRouter;
