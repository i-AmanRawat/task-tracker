"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";

import { createWorkspaceSchema } from "../schema";
import { useCreateWorkspace } from "../api/use-create-workspace";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export function CreateWorkspaceForm({ onCancel }: CreateWorkspaceFormProps) {
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    console.log(values);
    mutate({ json: values });
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="tex-xl font-bold">Create new workspace</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
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
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
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
                >
                  Cancel
                </Button>
                <Button disabled={isPending} type="submit" size={"lg"}>
                  Create Workspace
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
