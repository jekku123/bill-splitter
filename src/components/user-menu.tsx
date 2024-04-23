"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout, removeAccount } from "@/lib/auth/actions";
import { UserRound } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const deleteSchema = z.object({
  confirm: z.string().refine((v) => v === "Delete", {
    message: "Please type 'Delete' to confirm",
  }),
});

export function UserMenu({ user }: { user: User | undefined }) {
  const [open, setOpen] = useState(false);

  const userImage = user?.image as string;
  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {user && (
            <Avatar>
              <AvatarImage src={userImage} alt="user" />
              <AvatarFallback>
                {userInitials ? userInitials : <UserRound />}
              </AvatarFallback>
            </Avatar>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {user?.name ? user.name : user?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action={logout}>
              <button type="submit">Logout</button>
            </form>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteUserDialog
        userId={Number(user?.id)}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

export function DeleteUserDialog({
  userId,
  open,
  setOpen,
}: {
  userId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirm: "",
    },
  });

  async function onSubmit() {
    try {
      await removeAccount(userId);
      await logout();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type &quot;Delete&quot; to confirm</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
