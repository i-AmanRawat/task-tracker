import { Query } from "node-appwrite";

import { Workspace } from "@/features/workspaces/types";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";

//this is not a server action rather just a explicit layer we are adding to protect our route
//i could have added this code directly in the route i want to protect but that would be lots of code repetition
export async function getWorkspaces() {
  const { account, databases } = await createSessionClient();
  /*
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const cookieStore = cookies();
    const session = cookieStore.get(AUTH_COOKIE);

    if (!session) return { documents: [], total: 0 };

    client.setSession(session.value);

    const account = new Account(client);
    const databases = new Databases(client);
*/
  const user = await account.get();

  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user.$id),
  ]);

  if (members.total === 0) {
    return { documents: [], total: 0 };
  }

  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspaceIds),
  ]);

  return workspaces;
}

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

export async function getWorkspaceInfo({ workspaceId }: GetWorkspaceInfoProps) {
  const { databases } = await createSessionClient();

  const workspace = await databases.getDocument<Workspace>(
    DATABASE_ID,
    WORKSPACES_ID,
    workspaceId
  );

  return { name: workspace.name };
}
