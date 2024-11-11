import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;
type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;

export function useCreateTask() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({ json });

      if (!response.ok) {
        toast.error("Failed to create task");
        throw new Error("Failed to create task");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("task created");

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });

  return mutation;
}
