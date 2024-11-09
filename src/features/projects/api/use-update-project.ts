import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type RequestType = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  200
>;

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[":projectId"].$patch({
        form,
        param,
      });

      if (!response.ok) {
        toast.error("Failed to update project");
        throw new Error("Failed to update project");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("project updated");

      router.refresh(); //to refetch the server comp as the projects data will be staled
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });

  return mutation;
}
