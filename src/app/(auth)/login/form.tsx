'use client';

import FormButton from '@/components/ui/form-button';
import { Input } from '@/components/ui/input';
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
        <Input type="email" name="email" placeholder="Email" />
        <Input type="password" name="password" placeholder="Password" />
        <FormButton>Login</FormButton>
      </form>
      {/* <form action={githubLogin}>
        <FormButton size="icon" variant="ghost">
          <Icons.gitHub />
        </FormButton>
      </form> */}
      {state?.error && <span className="text-red-500">{state?.error}</span>}
    </div>
  );
}
