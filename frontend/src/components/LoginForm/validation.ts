import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Invalid username" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});
