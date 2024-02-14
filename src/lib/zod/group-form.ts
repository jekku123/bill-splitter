import { z } from "zod";

export const groupFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a name",
    })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, {
      message: "Name must be less than 20 characters",
    }),
  description: z
    .string()
    .min(1, { message: "Please enter a description" })
    .min(3, {
      message: "Description must be at least 3 characters",
    })
    .max(100, {
      message: "Description must be less than 100 characters",
    }),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;
