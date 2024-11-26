"use client";

import { useGetProject } from "@/features/projects/api/use-get-project";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";

export function ProjectIdSettingsClient() {
  const projectId = useProjectId();

  const { data, isLoading } = useGetProject({ projectId });

  if (isLoading) return <PageLoader />;

  if (!data) return <PageError message="Project not found" />;

  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectForm initialValues={data} />
    </div>
  );
}
