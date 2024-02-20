import { z } from "zod";

export const memberFormSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Please enter a name",
    })
    .max(10, {
      message: "Name must be less than 10 characters",
    })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, {
      message: "Name must be less than 20 characters",
    }),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
