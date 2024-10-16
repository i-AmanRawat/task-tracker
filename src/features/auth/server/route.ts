import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../schema";

//this chaining is required for making rpc work
const auth = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    console.log({ email, password });

    return c.json({
      email,
      password,
      message: "logged in successfully",
    });
  })
  .get("/hello", (c) => {
    return c.json({
      message: "helloworld!",
    });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = await c.req.valid("json");

    console.log({ name, email, password });
    return c.json({
      name,
      email,
      password,
      message: "successfully registered",
    });
  });

export default auth;
