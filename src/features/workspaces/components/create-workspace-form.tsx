"use client";

import { z } from "zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

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

import { createWorkspaceSchema } from "../schema";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export function CreateWorkspaceForm({ onCancel }: CreateWorkspaceFormProps) {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof createWorkspaceSchema>) {
    const data = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: data },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspace/${data.$id}`);
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
