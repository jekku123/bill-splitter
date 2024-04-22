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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { User } from "next-auth";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

const formState = {
  success: false,
  errors: undefined,
};

export function UserMenu({ user }: { user: User | undefined }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(
    removeAccount.bind(null, +user?.id!),
    formState,
  );

  const userImage = user?.image as string;
  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2);

  useEffect(() => {
    if (state.errors) {
      toast.error(state.errors.message);
    }
    if (state.success) {
      logout();
    }
  }, [state]);

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={formAction}>
              <AlertDialogAction type="submit">Continue</AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            Remove Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
