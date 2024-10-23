import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  imageurl: string;
  inviteCode: string;
  userId: string;
};
