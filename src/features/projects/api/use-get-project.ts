import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetProjectProps {
  projectId: string;
}

export function useGetProject({ projectId }: UseGetProjectProps) {
  const query = useQuery({
    queryKey: ["project", projectId], //will refetch as the taskid changes
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: { projectId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project detail");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
}
