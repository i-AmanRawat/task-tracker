"use client";

import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";

import { Project } from "@/features/projects/types";
import { updateProjectSchema } from "@/features/projects/schema";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";

import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

export function EditProjectForm({
  onCancel,
  initialValues,
}: EditProjectFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete project",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof updateProjectSchema>) {
    const data = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: data, param: { projectId: initialValues.$id } },
      {
        onError: () => form.reset(),
      }
    );
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  }

  async function handleDeleteProject() {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteProject(
      {
        param: { projectId: initialValues.$id },
      },
      {
        onSuccess: () => {
          // window.location.href = `/workspaces/${initialValues.workspaceId}`; //hard refresh plus redirect

          router.push(`/workspaces/${initialValues.workspaceId}`);
        },
      }
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <DeleteDialog />

      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                    )
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" /> Back
          </Button>
          <CardTitle className="tex-xl font-bold">
            {initialValues.name.charAt(0).toUpperCase() +
              initialValues.name.slice(1)}
          </CardTitle>
          <CardDescription className="text-xs">Project</CardDescription>
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
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormMessage /> {/* displays the errors */}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-7">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              fill
                              className="object-cover"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="logo"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Project Icon</p>

                          <p className="text-sm text-muted-foreground">
                            JPG, SVG, PNG, OR JPEG, max 1mb
                          </p>

                          <input
                            type="file"
                            accept=".jpg, .png, .svg, .jpeg"
                            ref={inputRef}
                            disabled={isPending}
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"destructive"}
                              size={"xs"}
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"teritary"}
                              size={"xs"}
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
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
                    save changes
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting project is irreversible and will remove all associated
              data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              onClick={handleDeleteProject}
              disabled={isPending || isDeletingProject}
              size="sm"
              variant={"destructive"}
              className="mt-6 w-fit ml-auto"
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
