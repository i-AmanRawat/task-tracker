"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createTaskSchema } from "@/features/tasks/schema";
import { useCreateTask } from "@/features/tasks/api/use-create-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { cn, snakeCaseToTitleCase } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { DatePicker } from "@/components/date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "../types";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
}

export function CreateTaskForm({
  onCancel,
  projectOptions,
  memberOptions,
}: CreateTaskFormProps) {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateTask();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof createTaskSchema>) {
    mutate(
      { json: { ...values, workspaceId } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
          //redirect to new task
        },
        onError: () => form.reset(),
      }
    );
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="tex-xl font-bold">Create new task</CardTitle>
        <CardDescription>Create your new task in one-click.</CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-7">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage /> {/* displays the errors */}
                  </FormItem>
                )}
              />

              {/* due date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} date={field.value} />
                    </FormControl>
                    <FormMessage /> {/* displays the errors */}
                  </FormItem>
                )}
              />

              {/* assignee */}
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar
                                className="size-6"
                                name={member.name}
                              />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage /> {/* displays the errors */}
                  </FormItem>
                )}
              />
              {/* status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TaskStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {snakeCaseToTitleCase(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage /> {/* displays the errors */}
                  </FormItem>
                )}
              />
              {/* project */}
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                className="size-6"
                                name={project.name}
                                image={project.imageUrl}
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage /> {/* displays the errors */}
                  </FormItem>
                )}
              />

              <DottedSeparator className="py-3" />
              <div className="flex items-center justify-between">
                <Button
                  disabled={isPending}
                  type="button"
                  size={"lg"}
                  variant="secondary"
                  onClick={onCancel}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button disabled={isPending} type="submit" size={"lg"}>
                  Create Task
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
