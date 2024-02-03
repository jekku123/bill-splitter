'use client';

import { login } from '@/lib/actions';
import { useFormState } from 'react-dom';

const initialState = {
  status: '',
  error: '',
};

export default function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 text-4xl font-bold">Login</h1>
      <form action={formAction}>
        <input type="email" name="email" placeholder="Email" className="text-black" />
        <input type="password" name="password" placeholder="Password" className="text-black" />
        <button>Login</button>
      </form>
      {state?.error && <span className="text-red-500">{state?.error}</span>}
    </div>
  );
}
