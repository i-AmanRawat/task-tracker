import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, TrashIcon } from "lucide-react";

import { Project } from "@/features/projects/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";

import { useConfirm } from "@/hooks/use-confirm";

import { Task } from "../types";
import { useDeleteTask } from "../api/use-delete-task";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
  const workspaceId = useWorkspaceId();

  const router = useRouter();

  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Delete task",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  async function handleDeleteTask() {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  }

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageurl}
        className="size-6 lg:size-8"
      />

      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>

      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>

      <Button
        onClick={handleDeleteTask}
        disabled={isPending}
        variant="destructive"
        size="sm"
        className="ml-auto"
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
}
