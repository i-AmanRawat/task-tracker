import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";

type ResquestType = InferRequestType<
  (typeof client.api.auth.register)["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;

export function useRegister() {
  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register["$post"]({ json });
      return response.json();
    },
  });
  return mutation;
}
