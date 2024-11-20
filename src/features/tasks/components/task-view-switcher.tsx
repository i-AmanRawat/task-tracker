"use client";

import { useCallback } from "react";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { DataFilters } from "@/features/tasks/components/data-filters";
import { columns } from "@/features/tasks/components/columns";
import { DataTable } from "@/features/tasks/components/data-table";
import { DataKanban } from "@/features/tasks/components/data-kanban";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DottedSeparator } from "@/components/dotted-separator";

import { TaskStatus } from "../types";
import { DataCalendar } from "./data-calendar";

import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";

export default function TaskViewSwitcher() {
  const [{ status, projectId, assigneeId, dueDate }] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    projectId,
    assigneeId,
    dueDate,
  });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdate({
        json: { tasks },
      });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="w-full flex flex-col gap-y-2 lg:flex-row items-center justify-between">
          <div className="">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                Table
              </TabsTrigger>
            </TabsList>
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                Kanban
              </TabsTrigger>
            </TabsList>
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
                Calendar
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="">
            <Button size="sm" className="w-full lg:w-auto" onClick={open}>
              <PlusIcon className="size-4 mr-2" />
              New
            </Button>
          </div>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full flex flex-col items-center justify-center border rounded-lg h-[200px]">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                onChange={onKanbanChange}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}{" "}
      </div>
    </Tabs>
  );
}
