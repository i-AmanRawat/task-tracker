import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Required" })
    .max(256, { message: "couldn't be more than 256 characters" }),
});
