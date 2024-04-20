"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import GitHubLogin from "@/components/ui/github-login";
import { login } from "@/lib/auth/actions";
import { LoginFormValues, loginFormSchema } from "@/lib/zod/login-form";

const defaultValues = {
  email: "",
  password: "",
};

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  const [generalError, setGeneralError] = useState("");

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await login(values);
      if (!result.success) {
        setGeneralError(result.error as string);
      }
    } catch (error) {
      // Error coming from successful login, why live like this?
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Login in to access the app</CardDescription>
        <span className="text-destructive" data-test-id="login-error">
          {generalError}
        </span>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            data-test-id="login-form"
          >
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
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                      autoFocus
                      {...field}
                      data-test-id="login-email"
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
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                      {...field}
                      data-test-id="login-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="my-4 w-full"
              disabled={form.formState.isSubmitting}
              aria-disabled={form.formState.isSubmitting}
              data-test-id="login-submit"
            >
              Login
              {form.formState.isSubmitting && (
                <Icons.spinner className="ml-2 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <GitHubLogin />
          <Button variant="outline" disabled className="w-full">
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center">
          Dont have an account?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
