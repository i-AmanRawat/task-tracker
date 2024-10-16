import "server-only";
import { Client, Account } from "node-appwrite";

//if the user is coming for the first time they can't create a account on app-write themself that's why we are using createAdminClient() function and not createSessionClient which will utilize the session we have created

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}
