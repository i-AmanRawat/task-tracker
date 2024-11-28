import z from "zod";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";

import { getMember } from "../utils";
import { Member, MemberRole } from "../types";

const members = new Hono()
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
      const { workspaceId } = c.req.valid("query");

      const user = c.get("user");
      const databases = c.get("databases");

      const { users } = await createAdminClient();

      //part of workspace or not
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) return c.json({ error: "Unauthorized" }, 401);

      //all members from repective workspace
      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      //populate data of members
      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
          };
        })
      );

      return c.json({
        data: {
          ...members,
          documents: populatedMembers,
        },
        success: true,
        message: "members fetched successfully",
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();

    const user = c.get("user");
    const databases = c.get("databases");

    //fetching the member user wants to delete
    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    //fetching all the members of the workspace
    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    //last member in the workspace can't be removed rather delete the workspace itself to remove last member
    if (allMembersInWorkspace.total === 1) {
      return c.json({
        success: false,
        message: "can't delete only member in workspace",
      });
    }
    //fetching the user's member details
    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    //return if user if not a member of the workspace
    if (!member)
      return c.json(
        {
          success: false,
          message: "unauthorized",
        },
        401
      );

    //user deleting themselves or admin deleting member
    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          success: false,
          message: "unauthorized",
        },
        401
      );
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({
      data: { $id: memberId },
      success: true,
      message: "member deleted successfully",
    });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        role: z.nativeEnum(MemberRole),
      })
    ),
    async (c) => {
      const { memberId } = c.req.param();

      const { role } = c.req.valid("json");

      const user = c.get("user");
      const databases = c.get("databases");

      //fetching the member -> admin wants to update
      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      //fetching all member in workspace to verify if its the only member
      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      if (allMembersInWorkspace.total === 1) {
        return c.json({
          success: false,
          message: "can't downgrade the only member",
        });
      }

      //fetching the user's member detail
      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      //return if user if not a member of the workspace
      if (!member)
        return c.json(
          {
            success: false,
            message: "unauthorized",
          },
          401
        );

      //only admin can update the role of other members
      if (member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            success: false,
            message: "unauthorized",
          },
          401
        );
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({
        data: { $id: memberId },
        success: true,
        message: "member deleted successfully",
      });
    }
  );

export default members;
