import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>; //although we are returning 2 res depending upon member wheather they are admin or not | so here we only want the successful response ie.200

export function useDeleteMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"].$delete({
        param,
      });

      if (!response.ok) {
        toast.error("Failed to delete member");
        throw new Error("Failed to delete member");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Member deleted");

      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Failed to delete member");
    },
  });

  return mutation;
}
