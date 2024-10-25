"use client";

import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
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

import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { updateWorkspaceSchema } from "../schema";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export function EditWorkspaceForm({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace(); //change
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Delete workspace",
    message: "This action cannot be undone",
    variant: "destructive",
  });

  const [ResetInviteCodeDialog, confirmResetInviteCode] = useConfirm({
    title: "Reset invite link",
    message: "This will invalidate current invite link",
    variant: "destructive",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof updateWorkspaceSchema>) {
    const data = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: data, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
          router.refresh();
        },
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

  async function handleDeleteWorkspace() {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  }

  const inviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  function handleCopyInviteLink() {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        toast.success("Invite link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy invite link to clipboard");
      });
  }

  async function handleResetInviteCode() {
    const ok = await confirmResetInviteCode();

    if (!ok) return;

    resetInviteCode(
      {
        param: {
          workspaceId: initialValues.$id,
        },
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <DeleteDialog />
      <ResetInviteCodeDialog />

      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" /> Back
          </Button>
          <CardTitle className="tex-xl font-bold">
            {initialValues.name.charAt(0).toUpperCase() +
              initialValues.name.slice(1)}
          </CardTitle>
          <CardDescription className="text-xs">Workspace</CardDescription>
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
                          <p className="text-sm">Workspace Icon</p>

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
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <DottedSeparator className="py-7" />
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={inviteLink} />
                <Button
                  variant={"secondary"}
                  onClick={handleCopyInviteLink}
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              onClick={handleResetInviteCode}
              disabled={isPending || isResettingInviteCode}
              size="sm"
              variant={"destructive"}
              className="mt-6 w-fit ml-auto"
            >
              Reset Invite Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting workspace is irreversible and will remove all associated
              data.
            </p>
            <DottedSeparator className="py-7" />
            <Button
              onClick={handleDeleteWorkspace}
              disabled={isPending || isDeletingWorkspace}
              size="sm"
              variant={"destructive"}
              className="mt-6 w-fit ml-auto"
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
