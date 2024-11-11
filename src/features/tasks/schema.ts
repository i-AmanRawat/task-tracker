import { z } from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  workspaceId: z.string().trim().min(1, { message: "Required" }),
  projectId: z.string().min(1, { message: "Required" }),
  name: z.string().min(1, { message: "Required" }),
  description: z.string().optional(),
  assigneeId: z.string().min(1, { message: "Required" }),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  dueDate: z.coerce.date(),
});
