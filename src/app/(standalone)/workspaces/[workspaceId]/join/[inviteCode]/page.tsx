import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";

interface JoinWorkspaceProps {
  params: { workspaceId: string; inviteCode: string };
}

export default async function JoinWorkspacePage({
  params,
}: JoinWorkspaceProps) {
  const { workspaceId } = params;

  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspaceInfo({ workspaceId });
  if (!workspace) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValue={workspace} />
    </div>
  );
}
