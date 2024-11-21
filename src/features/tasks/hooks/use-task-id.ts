import { useParams } from "next/navigation";

export function useTaskId() {
  const params = useParams();
  return params.taskId as string;
}
