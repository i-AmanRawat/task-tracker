import { useRouter } from "next/navigation";
import type { InferRequestType, InferResponseType } from "hono/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResquestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;
type ResponseType = InferResponseType<
  (typeof client.api.auth.login)["$post"],
  200
>;

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to log in");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logged in successfully");

      router.refresh(); //re-rendering Server Components
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to log in");
    },
  });

  return mutation;
}
