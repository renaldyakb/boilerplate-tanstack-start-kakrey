import { z } from "zod";
import { createTRPCRouter } from "../init";
import { publicProcedure, protectedProcedure } from "../procedures";
import { prisma } from "@/server/db";

export const todoRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    try {
      return await prisma.todo.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("🔴 [DB Error] in todo.list:", error);
      throw error;
    }
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const todo = await prisma.todo.create({
        data: { title: input.title },
      });
      return todo;
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.string().uuid(), completed: z.boolean() }))
    .mutation(async ({ input }) => {
      const todo = await prisma.todo.update({
        where: { id: input.id },
        data: { completed: input.completed },
      });
      return todo;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await prisma.todo.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
