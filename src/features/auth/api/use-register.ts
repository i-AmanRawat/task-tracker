import { useRouter } from "next/navigation";
import type { InferRequestType, InferResponseType } from "hono/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResquestType = InferRequestType<
  (typeof client.api.auth.register)["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register.$post({ json }); //current.$get() or ["$get"]() but while infering the request/response type ie.InferRequestType use [] syntax only

      if (!response.ok) {
        toast.error("Failed to register");
        throw new Error("Failed to register");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Registered successfully");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to register");
    },
  });
  return mutation;
}
