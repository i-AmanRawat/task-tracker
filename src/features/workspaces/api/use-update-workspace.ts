import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>; //although we are returning 2 res depending upon member wheather they are admin or not | so here we only want the successful response ie.200

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    // mutationKey: ["update-workspace"],ac
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"].$patch({
        form,
        param,
      });

      if (!response.ok) {
        toast.error("Failed to update workspace");
        throw new Error("Failed to update workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated");

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });

  return mutation;
}
