import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

interface UseGetTasksProps {
  workspaceId: string;
}

export function useGetTasks({ workspaceId }: UseGetTasksProps) {
  const query = useQuery({
    queryKey: ["tasks", workspaceId], //will refetch as the workspaceID changes
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        toast.error("Failed to fetch tasks detail");
        throw new Error("Failed to fetch tasks detail");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
}
