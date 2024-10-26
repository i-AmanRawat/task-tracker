"use client";

import Link from "next/link";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useJoinWorkspace } from "../api/use-join-workspace";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useInviteCode } from "../hooks/use-invite-code";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  initialValue: {
    name: string;
  };
}

export function JoinWorkspaceForm({ initialValue }: JoinWorkspaceFormProps) {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();

  const { mutate, isPending } = useJoinWorkspace();

  function handleJoin() {
    mutate(
      {
        param: {
          workspaceId,
          inviteCode,
        },
      },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
        },
      }
    );
  }

  return (
    <Card className="h-full w-full shadow-none border-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          You have been invited to join {initialValue.name} workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row item-center justify-between gap-2">
          <Button
            size={"lg"}
            variant={"secondary"}
            type="button"
            className="w-full lg:w-fit"
            asChild
            disabled={isPending}
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            size={"lg"}
            type="button"
            onClick={handleJoin}
            className="w-full lg:w-fit"
            disabled={isPending}
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
