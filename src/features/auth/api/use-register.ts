import { useRouter } from "next/navigation";
import type { InferRequestType, InferResponseType } from "hono/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

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

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
  });
  return mutation;
}
