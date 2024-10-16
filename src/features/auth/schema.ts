import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .email({ message: "Enter valid email" }),
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters" })
    .max(256, { message: "Maximum 256 characters" }),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, { message: "Required" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .email({ message: "Enter valid email" }),
  password: z
    .string()
    .min(6, { message: "Minimum 6 characters" })
    .max(256, { message: "Maximum 256 characters" }),
});
