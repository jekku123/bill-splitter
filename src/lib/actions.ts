"use server";

import { LoginFormValues } from "@/app/(auth)/login/form";
import { RegisterFormValues } from "@/app/(auth)/register/form";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { ZodError, z } from "zod";
import { signIn, signOut } from "./auth";
import {
  getUserByEmail,
  insertBill,
  insertGroupMember,
  insertUser,
} from "./drizzle/data-access2";
import { NewBill, NewGroupMember } from "./drizzle/schema";

const registerFormSchema = z
  .object({
    email: z
      .string()
      .email({
        message: "Please enter a valid email address",
      })
      .refine(
        async (email) => {
          const userExists = await getUserByEmail(email);
          return !userExists;
        },
        {
          message: "An account with that email already exists",
        },
      ),
    password: z.string().min(1, {
      message: "Please enter a password",
    }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export async function logout() {
  await signOut();
}

export const githubLogin = async () => {
  await signIn("github");
};

export async function register(fields: RegisterFormValues) {
  try {
    const { email, password } = await registerFormSchema.parseAsync(fields);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await insertUser({ email, password: hashedPassword });

    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError = error as ZodError;
      const errorMap = zodError.flatten().fieldErrors;

      return {
        success: false,
        errors: {
          email: errorMap["email"]?.[0] ?? "",
          password: errorMap["password"]?.[0] ?? "",
          confirmPassword: errorMap["confirmPassword"]?.[0] ?? "",
        },
      };
    }
    return {
      success: false,
      errors: {
        message:
          "Could not register user at this time. Please try again later.",
      },
    };
  }
}

export async function login(fields: LoginFormValues) {
  try {
    const user = await signIn("credentials", fields);
    return {
      user: user,
      success: true,
      error: undefined,
    };
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }
    }
    throw err;
  }
}

function getZodErrors(zodErrors: any) {
  // let errors{};

  // zodErrors.errors.forEach((issue) => {
  //   errors = {
  //     ...errors,
  //     [issue.path[0]]: issue.message,
  //   };
  // });

  return {
    errors: "gg",
  };
}

export async function addGroupMember(member: NewGroupMember) {
  try {
    const newGroupMember = await insertGroupMember({
      groupId: member.groupId,
      userId: member.userId,
      username: member.username,
    });

    if (!newGroupMember) {
      return {
        success: false,
        error:
          "Could not add group member at this time. Please try again later.",
      };
    }

    return {
      success: true,
      error: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: "Could not add group member at this time. Please try again later.",
    };
  }
}

export async function createBill(bill: NewBill) {
  try {
    const newBill = await insertBill(bill);

    if (!newBill) {
      return {
        success: false,
        error: "Could not create bill at this time. Please try again later.",
      };
    }

    return {
      success: true,
      error: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: "Could not create bill at this time. Please try again later.",
    };
  }
}
