'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FormButton from '@/components/ui/form-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form action={registerAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" />
            {state?.errors?.email && (
              <span className=" text-red-500 text-xs">{state?.errors?.email}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" />
            {state?.errors?.password && (
              <span className=" text-red-500 text-xs">{state?.errors?.password}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" name="confirmPassword" />
            {state?.errors?.confirmPassword && (
              <span className=" text-red-500 text-xs">{state?.errors?.confirmPassword}</span>
            )}
          </div>
          <FormButton className="w-full">Create account</FormButton>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button variant="outline">
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-center w-full">
          Already have an account?{' '}
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
