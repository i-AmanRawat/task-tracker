import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { WorkspaceIdClient } from "./client";

export default async function WorkSpaceIdPage() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return <WorkspaceIdClient />;
}
