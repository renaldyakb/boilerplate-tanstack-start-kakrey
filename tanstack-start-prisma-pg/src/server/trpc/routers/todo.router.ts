import { z } from "zod";
import { createTRPCRouter } from "../init";
import { publicProcedure } from "../procedures";
import { db } from "@/server/db";
export const todoRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    try {
      return await db.todo.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("🔴 [DB Error] in todo.list:", error);
      throw error;
    }
  }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const todo = await db.todo.create({
        data: { title: input.title },
      });
      return todo;
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.string().uuid(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      const todo = await db.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
      return todo;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.todo.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
