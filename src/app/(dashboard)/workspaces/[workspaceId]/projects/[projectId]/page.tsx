import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { ProjectIdClient } from "./client";

export default async function ProjectIdPage() {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return <ProjectIdClient />;
}
