"use server";

import { LoginFormValues } from "@/app/(auth)/login/form";
import { RegisterFormValues } from "@/app/(auth)/register/form";
import { GroupFormValues } from "@/components/create-group";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";
import { signIn, signOut } from "./auth";
import {
  createUser,
  deleteGroup,
  getUserByEmail,
  insertGroup,
  insertGroupMember,
} from "./drizzle/data-access";
import { NewGroup, NewGroupMember } from "./drizzle/schema";

const registerFormSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z.string().min(3, {
      message: "Please enter a password with at least 3 characters",
    }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const registerFormSchema2 = z
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
export type RegisterFormSchema2 = z.infer<typeof registerFormSchema2>;

export async function logout() {
  await signOut();
}

export async function register(_previousState: any, formData: FormData) {
  const userData = Object.fromEntries(formData);
  try {
    const { email, password } = registerFormSchema.parse(userData);

    const userExists = await getUserByEmail(email);

    if (userExists) {
      return {
        status: "error",
        errors: {
          message: "An account with that email already exists",
        },
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUser({ email, password: hashedPassword });

    return {
      status: "success",
      errors: undefined,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError = error as ZodError;
      const errorMap = zodError.flatten().fieldErrors;

      return {
        status: "error",
        errors: {
          email: errorMap["email"]?.[0] ?? "",
          password: errorMap["password"]?.[0] ?? "",
          confirmPassword: errorMap["confirmPassword"]?.[0] ?? "",
        },
      };
    }
    return {
      status: "error",
      errors: {
        message:
          "Could not register user at this time. Please try again later.",
      },
    };
  }
}

export const githubLogin = async () => {
  await signIn("github");
};

export async function login(_prevState: any, formData: FormData) {
  try {
    await signIn("credentials", formData);
    return {
      status: "success",
      error: undefined,
    };
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") {
        return {
          status: "error",
          error: "Invalid email or password",
        };
      }
    }
    throw err;
  }
}

export async function registerUser(fields: RegisterFormValues) {
  try {
    const { email, password } = await registerFormSchema2.parseAsync(fields);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUser({ email, password: hashedPassword });

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

export async function loginUser(fields: LoginFormValues) {
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

function getZodErrors(fields: RegisterFormValues) {
  const validatedFields = registerFormSchema.safeParse(fields);

  let zodErrors = {};

  if (!validatedFields.success) {
    validatedFields.error.issues.forEach((issue) => {
      zodErrors = {
        ...zodErrors,
        [issue.path[0]]: issue.message,
      };
    });
    return {
      success: false,
      errors: zodErrors,
    };
  } else {
    return {
      success: true,
      errors: undefined,
    };
  }
}

export async function createGroup(userId: string, values: GroupFormValues) {
  const newGroup: NewGroup = {
    createdBy: parseInt(userId),
    name: values.name,
    description: values.description,
  };

  const group = await insertGroup(newGroup);

  if (!group) {
    return {
      success: false,
      errors: {
        message: "Could not create group at this time. Please try again later.",
      },
    };
  }

  revalidatePath("/groups");

  return {
    success: true,
    errors: undefined,
  };
}

export async function removeGroup({ groupId }: { groupId: string }) {
  try {
    await deleteGroup({ groupId });
    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        message: "Could not delete group at this time. Please try again later.",
      },
    };
  }
}

export async function addGroupMember({ userId, groupId }: NewGroupMember) {
  try {
    const newGroupMember = await insertGroupMember({ userId, groupId });

    console.log(newGroupMember);

    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        message:
          "Could not add user to group at this time. Please try again later.",
      },
    };
  }
}
