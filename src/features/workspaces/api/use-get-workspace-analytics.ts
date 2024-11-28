import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["analytics"]["$get"],
  200
>;

export function useGetWorkspaceAnalytics({
  workspaceId,
}: UseGetWorkspaceAnalyticsProps) {
  const query = useQuery({
    queryKey: ["project-analytics", workspaceId], //will refetch as the taskid changes
    queryFn: async () => {
      const response = await client.api.workspaces[
        ":workspaceId"
      ].analytics.$get({
        param: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace analytics");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
}
