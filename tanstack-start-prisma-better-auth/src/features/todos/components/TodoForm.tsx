import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toastSuccess, toastError } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { trpc, queryClient } from "@/router";
import { useMutation } from "@tanstack/react-query";

export function TodoForm() {
  const [title, setTitle] = useState("");


  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.todo.list.queryOptions().queryKey,
        });
        toastSuccess("Todo created successfully");
        setTitle("");
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toastError("You must login first.", {
            action: {
              label: "Login",
              onClick: () => (window.location.href = "/login"),
            },
          });
        } else {
          toastError(error.message);
        }
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({ title });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <Input
        placeholder="Add a new todo..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={createMutation.isPending}
        className="flex-1"
      />
      <Button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4 mr-2" />
        )}
        Add
      </Button>
    </form>
  );
}
