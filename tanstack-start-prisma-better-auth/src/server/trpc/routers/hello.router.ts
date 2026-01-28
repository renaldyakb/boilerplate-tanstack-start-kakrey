/**
 * Hello Router
 *
 * Simple router for greeting endpoints.
 */

import { createTRPCRouter } from "../init";
import { publicProcedure } from "../procedures";

/**
 * Hello router with simple greeting procedures.
 */
export const helloRouter = createTRPCRouter({
  /**
   * Simple hello greeting.
   *
   * @example
   * const greeting = await trpc.hello.greet.query()
   * // Returns: "Hello world!"
   */
  greet: publicProcedure.query(() => {
    return "Hello kakrey birin!";
  }),
});
