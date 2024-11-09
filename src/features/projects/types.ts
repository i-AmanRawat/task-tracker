import { Models } from "node-appwrite";

export type Project = Models.Document & {
  name: string;
  imageurl: string;
  workspaceId: string;
};
