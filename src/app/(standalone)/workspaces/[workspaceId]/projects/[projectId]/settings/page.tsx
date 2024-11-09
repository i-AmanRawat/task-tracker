import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

interface ProjectIdSettingsPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectIdSettingsPage({
  params,
}: ProjectIdSettingsPageProps) {
  const { projectId } = params;

  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const project = await getProject({ projectId });

  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectForm initialValues={project} />
    </div>
  );
}
