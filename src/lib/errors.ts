import { AuthError } from 'next-auth';
import { ZodError } from 'zod';

export function handleError(error: any) {
  console.error(error);

  if (error instanceof ZodError) {
    return handleZodError(error);
  } else if (error instanceof AuthError && error.type === 'CredentialsSignin') {
    return {
      status: 'error',
      error: 'Invalid email or password',
    };
  } else {
    return {
      status: 'error',
      errors: {
        message: 'Something went wrong :(',
      },
    };
  }
}

function handleZodError(error: ZodError) {
  const errorMap = error.flatten().fieldErrors;
  return {
    status: 'error',
    errors: errorMap,
  };
}
