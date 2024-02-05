'use client';

import FormButton from '@/components/ui/form-button';
import { Input } from '@/components/ui/input';
import { register } from '@/lib/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

const initialState = {
  status: '',
  errors: undefined,
};

export default function RegisterForm() {
  const [state, registerAction] = useFormState(register, initialState);

  const router = useRouter();

  useEffect(() => {
    if (state?.status === 'success') {
      router.push('/login');
    }
  }, [state?.status, router]);

  return (
    <form action={registerAction}>
      <Input type="email" placeholder="email" name="email" />
      {state?.errors?.email && <p>{state?.errors?.email}</p>}
      <Input type="password" placeholder="password" name="password" />
      {state?.errors?.password && <p>{state?.errors?.password}</p>}
      <Input type="password" placeholder="password again" name="confirmPassword" />
      {state?.errors?.confirmPassword && <p>{state?.errors?.confirmPassword}</p>}
      <FormButton>Register</FormButton>
      <Link href="/login">
        Have an account? <b>Login</b>
      </Link>
      {state?.errors?.message && <p>{state?.errors?.message}</p>}
    </form>
  );
}
