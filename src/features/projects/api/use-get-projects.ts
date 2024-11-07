import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

interface UseGetProjectsProps {
  workspaceId: string;
}

export function useGetProjects({ workspaceId }: UseGetProjectsProps) {
  const query = useQuery({
    queryKey: ["projects", workspaceId], //will refetch as the workspaceID changes
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        toast.error("Failed to fetch projects detail");
        throw new Error("Failed to fetch projects detail");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
}
