import { z } from "zod";
export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  userEmail: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  height: z.coerce
    .number()
    .min(50, "Minimum height is 50")
    .max(250, "Maximum height is 250"),
  weight: z.coerce
    .number()
    .min(20, "Minimum weight is 20")
    .max(400, "Maximum weight is 400"),
});
