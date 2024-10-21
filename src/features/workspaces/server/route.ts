import { Hono } from "hono";
import { ID } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";

import { createWorkspaceSchema } from "../schema";

const workspace = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID
    );

    return c.json({
      data: workspaces,
      success: true,
      message: "fetched workspace successfully",
    });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        /*
        ArrayBuffer: Raw binary data.
        Base64: Textual encoding of binary data.      
        (ArrayBuffer to Base64) when you need to send the binary data as text (e.g., in JSON, HTML, etc.).
      */

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
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
