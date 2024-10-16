import type { InferRequestType, InferResponseType } from "hono/client";
import { useMutation } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResquestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;
type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;

export function useLogin() {
  const mutation = useMutation<ResponseType, Error, ResquestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });
      return await response.json();
    },
  });
  return mutation;
}
