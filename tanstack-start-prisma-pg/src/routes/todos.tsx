import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/loaders";
import { TodoForm } from "@/features/todos/components/TodoForm";
import { TodoList } from "@/features/todos/components/TodoList";
import { trpc, queryClient } from "@/router";

export const Route = createFileRoute("/todos")({
  loader: async () => {
    await queryClient.ensureQueryData(trpc.todo.list.queryOptions());
  },
  component: TodosPage,
});

function TodosPage() {
  return (
    <div className="container max-w-2xl py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Todos</h1>
      
      <div className="bg-background rounded-xl border p-6 shadow-sm">
        <TodoForm />
        
        <Suspense fallback={<CardSkeleton />}>
          <TodoList />
        </Suspense>
      </div>
    </div>
  );
}
