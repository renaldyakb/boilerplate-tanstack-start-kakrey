import { z } from "zod";
import { createTRPCRouter } from "../init";
import { publicProcedure, protectedProcedure } from "../procedures";
import { db } from "@/server/db";
import { todos } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const todoRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    try {
      return await db.select().from(todos).orderBy(desc(todos.createdAt));
    } catch (error) {
      console.error("🔴 [DB Error] in todo.list:", error);
      throw error;
    }
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [todo] = await db
        .insert(todos)
        .values({ title: input.title })
        .returning();
      return todo;
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.string().uuid(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      const [todo] = await db
        .update(todos)
        .set({ completed: input.completed })
        .where(eq(todos.id, input.id))
        .returning();
      return todo;
    }),
    
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(todos).where(eq(todos.id, input.id));
      return { success: true };
    }),
});
