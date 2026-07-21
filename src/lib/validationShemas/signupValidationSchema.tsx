import { z } from "zod";
export const signupSchema = z.object({
  username: z.string().min(3, "validation.usernameMin"),
  userEmail: z.string().email("validation.emailInvalid"),
  password: z.string().min(6, "validation.passwordMin"),
  height: z.coerce
    .number()
    .min(50, "validation.heightMin")
    .max(250, "validation.heightMax"),
  weight: z.coerce
    .number()
    .min(20, "validation.weightMin")
    .max(400, "validation.weightMax"),
  yearOfBirth: z.coerce
    .number()
    .min(1900, "validation.yearOfBirthMin")
    .max(new Date().getFullYear(), "validation.yearOfBirthMax"),
  gender: z.enum(["male", "female"]),
});
