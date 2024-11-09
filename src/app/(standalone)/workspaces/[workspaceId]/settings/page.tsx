import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspaceIdSettingsPage({
  params,
}: WorkspaceIdSettingsPageProps) {
  const workspaceId = params.workspaceId;

  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspace({ workspaceId });

  return (
    <div className="w-full lg:max-w-2xl">
      {/* <div className=""> */}
      <EditWorkspaceForm initialValues={workspace} />
    </div>
  );
}
