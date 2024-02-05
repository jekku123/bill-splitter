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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerUser } from '@/lib/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

const registerFormSchema = z
  .object({
    email: z.string().email({
      message: 'Please enter a valid email address',
    }),
    password: z
      .string()
      .min(1, {
        message: 'Please enter a password',
      })
      .min(4, {
        message: 'Password must be at least 4 characters',
      }),
    confirmPassword: z.string().min(1, {
      message: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  const [generalError, setGeneralError] = useState('');

  const router = useRouter();

  async function onSubmit(values: RegisterFormValues) {
    const result = await registerUser(values);

    if (result.errors) {
      const errors = result.errors;
      if (errors.email) {
        form.setError('email', {
          message: errors.email,
          type: 'server',
        });
      } else if (errors.password) {
        form.setError('password', {
          message: errors.password,
          type: 'server',
        });
      } else if (errors.confirmPassword) {
        form.setError('confirmPassword', {
          message: errors.confirmPassword,
          type: 'server',
        });
      } else if (errors.message) {
        setGeneralError(errors.message);
      } else {
        alert('An unknown error occurred');
      }
    }

    if (result.success) {
      router.push('/login');
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        !!form.formState.errors.email
                          ? 'border-destructive focus-visible:ring-destructive'
                          : ''
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className={
                        !!form.formState.errors.password
                          ? 'border-destructive focus-visible:ring-destructive'
                          : ''
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className={
                        !!form.formState.errors.confirmPassword
                          ? 'border-destructive focus-visible:ring-destructive'
                          : ''
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full my-4"
              disabled={form.formState.isSubmitting}
              aria-disabled={form.formState.isSubmitting}
            >
              Create account
              {form.formState.isSubmitting && <Icons.spinner className="animate-spin ml-2" />}
            </Button>
          </form>
        </Form>
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
