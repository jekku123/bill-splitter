'use client';

import { register } from '@/lib/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

const initialState = {
  status: '',
  errors: undefined,
};

const RegisterForm = () => {
  const [state, registerAction] = useFormState(register, initialState);

  const router = useRouter();

  useEffect(() => {
    if (state?.status === 'success') {
      router.push('/login');
    }
  }, [state?.status, router]);

  return (
    <form action={registerAction}>
      <input type="email" placeholder="email" name="email" className="text-black" />
      <input type="password" placeholder="password" name="password" className="text-black" />
      {/* <input type="password" placeholder="password again" name="passwordRepeat" /> */}
      <button>Register</button>
      <Link href="/login">
        Have an account? <b>Login</b>
      </Link>
    </form>
  );
};

export default RegisterForm;
