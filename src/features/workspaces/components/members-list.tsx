"use client";

import Link from "next/link";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { Fragment } from "react";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { MemberRole } from "@/features/members/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";

export function MembersList() {
  const workspaceId = useWorkspaceId();

  const [DeleteDialog, confirmDelete] = useConfirm({
    title: "Remove member",
    message: "This member will be removed from the workspace",
    variant: "destructive",
  });

  const { data } = useGetMembers({ workspaceId });
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();

  function handleUpdateMember(memberId: string, role: MemberRole) {
    updateMember({
      json: {
        role,
      },
      param: {
        memberId,
      },
    });
  }

  async function handleDeleteMember(memberId: string) {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteMember(
      {
        param: {
          memberId,
        },
      },
      { onSuccess: () => window.location.reload() }
    );
  }

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild size="sm" variant="secondary">
          <Link href={`/workspace/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          workspace
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex gap-2 item-center">
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="ml-auto" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={isUpdatingMember}
                    className="font-medium"
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                    disabled={isUpdatingMember}
                    className="font-medium"
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isDeletingMember}
                    className="font-medium"
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-2.5" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
