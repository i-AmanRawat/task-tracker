import { Hono } from "hono";
import { ID } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";

import { createWorkspaceSchema } from "../schema";

const workspace = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("json", createWorkspaceSchema),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { name } = c.req.valid("json");

    const workspace = databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      }
    );

    return c.json({
      data: workspace,
      success: true,
      message: "created workspace successfully",
    });
  }
);

export default workspace;
