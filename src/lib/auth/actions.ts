"use server";

import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { ZodError } from "zod";
import { getUserByEmail, insertUser } from "../../drizzle/data-access";
import { LoginFormValues } from "../zod/login-form";
import { RegisterFormValues, registerFormSchema } from "../zod/register-form";
import { signIn, signOut } from "./auth";

export async function logout() {
  await signOut();
}

export const githubLogin = async () => {
  await signIn("github");
};

export async function register(values: RegisterFormValues) {
  try {
    const { email, password } = registerFormSchema.parse(values);

    const isEmailTaken = await getUserByEmail(email);

    if (isEmailTaken) {
      return {
        success: false,
        errors: {
          email: "An account with that email already exists",
        },
      };
    }

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

export async function login(values: LoginFormValues) {
  try {
    await signIn("credentials", values);
    return {
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
