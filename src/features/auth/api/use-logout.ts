import type { InferResponseType } from "hono/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();

      if (!response.ok) {
        toast.error("Failed to logout");
        throw new Error("Failed to logout");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });
  return mutation;
}
