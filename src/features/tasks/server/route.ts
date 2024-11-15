import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";
import { Task, TaskStatus } from "@/features/tasks/types";
import { createTaskSchema } from "@/features/tasks/schema";
import { Project } from "@/features/projects/types";

import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";

const tasks = new Hono()
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
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

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json({
      data: { $id: taskId },
      success: true,
      message: "deleted task successfully",
    });
  })
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid("query");

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

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("project ID : ", projectId);
        query.push(Query.equal("projectId", projectId));
      }

      if (assigneeId) {
        console.log("assignee ID : ", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (status) {
        console.log("status : ", status);
        query.push(Query.equal("status", status));
      }

      if (search) {
        console.log("search(name) : ", search);
        query.push(Query.equal("name", search));
      }

      if (dueDate) {
        console.log("dueDate : ", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );

        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return { ...task, assignee, project };
      });

      return c.json({
        success: true,
        data: { ...tasks, documents: populatedTasks },
        message: "successful",
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { name, status, dueDate, projectId, assigneeId, workspaceId } =
        c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId: workspaceId,
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

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
          position: newPosition,
        }
      );

      return c.json({
        data: task,
        success: true,
        message: "created task successfully",
      });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { taskId } = c.req.param();

      const { name, status, dueDate, projectId, assigneeId, description } =
        c.req.valid("json");

      const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
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

      const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          name,
          status,
          projectId,
          assigneeId,
          dueDate,
          description,
        }
      );

      return c.json({
        data: task,
        success: true,
        message: "updated task successfully",
      });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user");
    const { users } = await createAdminClient();
    const databases = c.get("databases");

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return c.json(
        {
          success: false,
          message: "unauthorized",
        },
        401
      );
    }

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );

    const member = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name || user.email,
      email: user.email,
    };

    return c.json({
      data: { task, project, assignee },
      success: true,
      message: "task found",
    });
  });

export default tasks;
