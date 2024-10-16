import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export function useCurrent() {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();
      //* wrapping fetch() around try/catch doesn't throw errors in catch part //use axios for that
      if (!response.ok) {
        return null;
      }
      const { data } = await response.json();

      return data;
    },
  });
  return query;
}
