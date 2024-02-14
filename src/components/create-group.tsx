"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "next-auth";
import { useForm } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { toast } from "sonner";

import { createGroupAction } from "@/lib/actions/group-actions";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Textarea } from "./ui/textarea";

const groupFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Please enter a name",
    })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, {
      message: "Name must be less than 20 characters",
    }),
  description: z
    .string()
    .min(1, { message: "Please enter a description" })
    .min(3, {
      message: "Description must be at least 3 characters",
    })
    .max(100, {
      message: "Description must be less than 100 characters",
    }),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;

export default function CreateGroupDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: GroupFormValues) {
    const result = await createGroupAction(user.id!, values);

    if (!result.success) {
      toast("Failed to create group");
      return;
    }

    toast("Group created", {});
    form.reset();
    setOpen(false);
    // if (result.errors) {
    //   const errors = result.errors;
    //   if (errors.name) {
    //     form.setError("name", {
    //       message: errors.name,
    //       type: "server",
    //     });
    //   } else if (errors.description) {
    //     form.setError("description", {
    //       message: errors.description,
    //       type: "server",
    //     });
    //   }
    // }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Add a new group to keep track of the debts between friends.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        "col-span-3",
                        !!errors.name
                          ? "border-destructive focus-visible:ring-destructive"
                          : "",
                      )}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className={cn(
                        "col-span-3 resize-none",
                        !!errors.description
                          ? "border-destructive focus-visible:ring-destructive"
                          : "",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-center gap-4 sm:justify-end">
              <Button
                variant="default"
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                Save
                {isSubmitting && (
                  <Icons.spinner className="ml-2 animate-spin" />
                )}
              </Button>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
