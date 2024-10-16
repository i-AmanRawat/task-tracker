import type { InferRequestType, InferResponseType } from "hono/client";

import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";

type ResquestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;
type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;

export function useLogin() {
  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login["$post"]({ json });
      return response.json();
    },
  });
  return mutation;
}
