import { RiAddCircleFill } from "react-icons/ri";

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
  const { data: workspaces } = useGetWorkspaces();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-center">
        <p className="text-xs uppercase text-neutral-500">workspaces</p>
        <RiAddCircleFill className="size-5 cursor-pointer text-neutral-500" />
      </div>

      <Select>
        <SelectTrigger className="w-full font-medium text-neutral-200 p-1">
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
