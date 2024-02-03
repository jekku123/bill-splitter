'use server';

import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import { signIn, signOut } from './auth';
import { db } from './drizzle';
import { users } from './drizzle/schema';

// const registerSchema = z.object({
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   password: z
//     .string()
//     .min(3, { message: "Password has to be atleast 3 characters" }),
// });

// const validationSchema = z
//   .object({
//     email: z.string().email(),
//     password: z.string().min(3),
//     passwordRepeat: z.string(),
//   })
//   .refine((data) => data.password === data.passwordRepeat, {
//     message: "Passwords don't match",
//     path: ["passwordRepeat"],
//   });

export async function logout() {
  await signOut();
}

export async function register(previousState: any, formData: FormData) {
  //   const userData = Object.fromEntries(formData);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // const { email, password } = validationSchema.parse(userData);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      email,
      password: hashedPassword,
    };

    await db.insert(users).values(user);

    return {
      status: 'success',
      errors: undefined,
    };
  } catch (error) {
    console.error(error);

    // if (error instanceof ZodError) {
    //   const zodError = error as ZodError;
    //   const errorMap = zodError.flatten().fieldErrors;

    //   return {
    //     message: 'error',
    //     errors: {
    //       email: errorMap['email']?.[0] ?? '',
    //       password: errorMap['password']?.[0] ?? '',
    //       passwordRepeat: errorMap['paswordRepeat']?.[0] ?? '',
    //     },
    //   };
    // }
    return {
      status: 'error',
      errors: {
        email: 'An account with that email already exists',
      },
    };
  }
}

export const githubLogin = async () => {
  await signIn('github');
};

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signIn('credentials', {
      email,
      password,
    });
    return {
      status: 'success',
      error: undefined,
    };
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.message.includes('credentialssignin')) {
        return {
          status: 'error',
          error: 'Invalid email or password',
        };
      }
    }
    throw err;
  }
}

// function getErrorMessage(error: unknown) {
//   if (error instanceof Error) return error.message;
//   return String(error);
// }
