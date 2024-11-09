import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";

import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";

interface GetProjectProps {
  projectId: string;
}

export async function getProject({ projectId }: GetProjectProps) {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member = await getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id,
  });

  if (!member) {
    throw new Error("unauthorized");
  }

  return project;
}
