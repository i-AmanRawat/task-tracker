import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .max(256, { message: "couldn't be more than 256 characters" }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .max(256, { message: "couldn't be more than 256 characters" })
    .optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
