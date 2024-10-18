import { Hono } from "hono";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { loginSchema, registerSchema } from "../schema";
import { AUTH_COOKIE } from "../constants";

//this chaining is required for making rpc work
const auth = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");

    return c.json({ success: true, data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "Strict",
    });

    return c.json({
      success: true,
      message: "successfully logged in",
    });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "Strict",
    });

    return c.json({
      success: true,
      message: "successfully registered",
    });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);

    await account.deleteSession("current");

    return c.json({
      success: true,
      message: "logged out successfully",
    });
  });

export default auth;
