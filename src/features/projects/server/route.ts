import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";

import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema } from "../schema";

const projects = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          {
            success: false,
            message: "unauthorized",
          },
          401
        );
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({
        data: project,
        success: true,
        message: "created project successfully",
      });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId)
        return c.json(
          {
            success: false,
            message: "workspaceId missing",
          },
          400
        );

      //wheather member is allowed to access the project or not
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          {
            success: false,
            message: "unauthorized",
          },
          401
        );
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({
        data: projects,
        success: true,
        message: "project fetched successfully",
      });
    }
  );

export default projects;
