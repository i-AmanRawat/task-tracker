import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-update"]["$post"],
  200
>;

export function useBulkUpdateTasks() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-update"].$post({
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update tasks");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("tasks updated");

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
    },
    onError: () => {
      toast.error("Failed to update tasks");
    },
  });

  return mutation;
}
