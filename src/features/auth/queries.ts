import { createSessionClient } from "@/lib/appwrite";

//this is not a server action rather just a explicit layer we are adding to protect our route
//i could have added this code directly in the route i want to protect but that would be lots of code repetition
export async function getCurrent() {
  try {
    const { account } = await createSessionClient();

    /*
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const cookieStore = cookies();
    const session = cookieStore.get(AUTH_COOKIE);

    if (!session) return null;

    client.setSession(session.value);

    const account = new Account(client);
    */

    return await account.get();
  } catch (e) {
    console.error(e);
    return null;
  }
}
