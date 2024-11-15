import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;

export function useDeleteTask() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"].$delete({ param });

      if (!response.ok) {
        toast.error("Failed to delete task");
        throw new Error("Failed to delete task");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("task deleted");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  return mutation;
}
