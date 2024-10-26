import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";

// export const runtime = "edge";

const app = new Hono()
  .basePath("/api")
  .use("*", cors())
  .route("/auth", auth)
  .route("/workspaces", workspaces);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
