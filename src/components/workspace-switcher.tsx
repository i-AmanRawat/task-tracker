"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WorkspaceSwitcher() {
  const router = useRouter();
  const workspaceId = useWorkspaceId(); //to make the switcher component controlled
  const { data: workspaces } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();

  console.log("workspace: ", workspaces);

  function onSelect(id: string) {
    router.push(`/workspace/${id}`);
  }

  return (
    <div className="flex flex-col gap-y-2 ring-transparent">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>

      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full font-medium text-neutral-500 p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex items-center justify-between gap-3 font-medium">
                <WorkspaceAvatar
                  image={workspace.imageUrl}
                  name={workspace.name}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
