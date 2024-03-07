"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@/drizzle/schema";
import { updateProfile } from "@/lib/auth/actions";
import { ProfileFormValues, profileFormSchema } from "@/lib/zod/profile-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ProfileForm({ user }: { user: User }) {
  const defaultValues = {
    email: user.email,
    password: "",
    username: user.username || "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  async function onSubmit(values: ProfileFormValues) {
    const result = await updateProfile(user.id, values);

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
      } else if (errors.username) {
        form.setError("username", {
          message: errors.username,
          type: "server",
        });
      } else if (errors.message) {
        toast.error(errors.message);
      }
    }

    if (result.success) {
      toast.success("Account updated successfully!");
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Update profile</CardTitle>
        <CardDescription>
          Here you can update your account information.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        !!form.formState.errors.username
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      className={
                        !!form.formState.errors.email
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
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
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
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
              className="my-4 w-full"
              disabled={form.formState.isSubmitting}
              aria-disabled={form.formState.isSubmitting}
            >
              Update account
              {form.formState.isSubmitting && (
                <Icons.spinner className="ml-2 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
