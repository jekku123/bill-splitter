"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
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
import GitHubLogin from "@/components/ui/github-login";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/auth/actions";
import {
  RegisterFormValues,
  registerFormSchema,
} from "@/lib/zod/register-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const defaultValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  const router = useRouter();

  async function onSubmit(values: RegisterFormValues) {
    const result = await register(values);

    if (result.errors) {
      const errors = result.errors;

      if (errors.email) {
        form.setError("email", {
          message: errors.email,
          type: "server",
        });
      } else if (errors.password) {
        form.setError("password", {
          message: errors.password,
          type: "server",
        });
      } else if (errors.confirmPassword) {
        form.setError("confirmPassword", {
          message: errors.confirmPassword,
          type: "server",
        });
      } else if (errors.message) {
        toast.error(errors.message);
      }
    }

    if (result.success) {
      toast.success("Account created successfully! Please login.");
      router.push("/login");
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          And start splitting bills with your friends
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            data-test-id="register-form"
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
                      {...field}
                      data-test-id="register-email"
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
                      data-test-id="register-password"
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
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                      {...field}
                      data-test-id="register-confirm-password"
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
              data-test-id="register-submit"
            >
              Create account
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
          <Button disabled variant="outline" className="w-full">
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="w-full text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
