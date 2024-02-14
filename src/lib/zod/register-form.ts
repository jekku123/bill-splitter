import { z } from "zod";

// export const registerFormSchema = z
//   .object({
//     email: z
//       .string()
//       .email({
//         message: "Please enter a valid email address",
//       })
//   .refine(
//     async (email) => {
//       const userExists = await getUserByEmail(email);
//       return !userExists;
//     },
//     {
//       message: "An account with that email already exists",
//     },
//   ),
//     password: z.string().min(1, {
//       message: "Please enter a password",
//     }),
//     confirmPassword: z.string().min(1, {
//       message: "Please confirm your password",
//     }),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const registerFormSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters",
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
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
