import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<(typeof client.api.workspace)["$post"]>;
type ResponseType = InferResponseType<(typeof client.api.workspace)["$post"]>;

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // mutationKey: ["create-workspace"],ac
    mutationFn: async ({ form }) => {
      const response = await client.api.workspace.$post({ form });

      if (!response.ok) {
        toast.error("Failed to create workspace");
        throw new Error("Failed to create workspace");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created");

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });

  return mutation;
}
