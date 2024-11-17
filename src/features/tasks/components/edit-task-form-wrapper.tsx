import { Loader } from "lucide-react";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { EditTaskForm } from "@/features/tasks/components/edit-task-form";

import { Card, CardContent } from "@/components/ui/card";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string; //task id
}

export default function EditTaskFormWrapper({
  onCancel,
  id,
}: EditTaskFormWrapperProps) {
  const workspaceId = useWorkspaceId();

  const { data: initialTaskValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialTaskValues) {
    return null;
  }

  return (
    <EditTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      initialValues={initialTaskValues.task}
    />
  );
}