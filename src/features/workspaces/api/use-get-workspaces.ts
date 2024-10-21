import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

export function useGetWorkspaces() {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspace.$get();

      if (!response.ok) {
        toast.error("Failed to fetch workspacea detail");
        throw new Error("Failed to fetch workspaces detail");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
}
