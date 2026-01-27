import { Button } from "@/components/ui/button";
import { toastSuccess, toastError } from "@/lib/toast";
import { trpc, queryClient } from "@/router";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { Check, Trash2 } from "lucide-react";

export function TodoList() {
  const { data: todos } = useSuspenseQuery(trpc.todo.list.queryOptions());

  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.todo.list.queryOptions().queryKey,
        });
      },
    }),
  );

  const toggleMutation = useMutation(
    trpc.todo.toggle.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({
          queryKey: trpc.todo.list.queryOptions().queryKey,
        });
        toastSuccess(data.completed ? "Todo completed" : "Todo uncompleted", {
          action: {
            label: "Undo",
            onClick: () =>
              toggleMutation.mutate({
                id: data.id,
                completed: !data.completed,
              }),
          },
        });
      },
    }),
  );

  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
      onSuccess: async (data, variables) => {
        await queryClient.invalidateQueries({
          queryKey: trpc.todo.list.queryOptions().queryKey,
        });

        // Find the todo that was deleted to restore it if needed
        const deletedTodo = todos.find((t) => t.id === variables.id);

        toastError("Todo deleted", {
          action: {
            label: "Undo",
            onClick: () => {
              if (deletedTodo) {
                createMutation.mutate({ title: deletedTodo.title });
              }
            },
          },
        });
      },
    }),
  );

  if (todos.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No todos yet. Add one above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm"
        >
          <div className="flex items-center gap-4">
            <Button
              variant={todo.completed ? "default" : "outline"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() =>
                toggleMutation.mutate({
                  id: todo.id,
                  completed: !todo.completed,
                })
              }
              disabled={toggleMutation.isPending}
            >
              {todo.completed ? (
                <Check className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4" />
              )}
            </Button>
            <span
              className={
                todo.completed
                  ? "line-through text-muted-foreground"
                  : "font-medium"
              }
            >
              {todo.title}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => deleteMutation.mutate({ id: todo.id })}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
