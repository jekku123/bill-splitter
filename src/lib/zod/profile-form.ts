import { z } from "zod";

export const profileFormSchema = z.object({
  username: z.string().min(1, {
    message: "Please enter a username",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(1, {
      message: "Please enter a password",
    })
    .min(4, {
      message: "Password must be at least 4 characters",
    }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
