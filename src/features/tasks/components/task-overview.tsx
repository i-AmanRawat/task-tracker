import { PencilIcon } from "lucide-react";

import { MemberAvatar } from "@/features/members/components/member-avatar";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";

import { OverviewProperty } from "./overview-property";

import { Task } from "../types";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskOverviewProps {
  task: Task;
  assigneeName: string;
}

export function TaskOverview({ task, assigneeName }: TaskOverviewProps) {
  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button onClick={() => open(task.$id)} variant="secondary">
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={assigneeName} className="size-6" />
            <p className="text-sm font-medium">{assigneeName}</p>
          </OverviewProperty>

          <OverviewProperty label="Due Date">
            <TaskDate date={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>

          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}