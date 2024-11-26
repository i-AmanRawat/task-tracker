import { useParams } from "next/navigation";

export function useProjectId() {
  const params = useParams();

  return params.projectId as string;
}
