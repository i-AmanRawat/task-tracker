import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/action";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export default async function Home() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <div className="h-full flex justify-center">
      <CreateWorkspaceForm />
    </div>
  );
}
