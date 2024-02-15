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
import { GroupFormValues, groupFormSchema } from "@/lib/zod/group-form";
import { Textarea } from "./ui/textarea";

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

      if (result.errors) {
        const errors = result.errors;

        if (errors.name) {
          form.setError("name", {
            message: errors.name,
            type: "server",
          });
        }
        if (errors.description) {
          form.setError("description", {
            message: errors.description,
            type: "server",
          });
        }
        if (errors.message) {
          toast.error(errors.message);
        }
      }
      return;
    }

    toast.success("Group created");
    form.reset();
    setOpen(false);
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
                  <div className="col-span-3 flex flex-col gap-1">
                    <FormControl>
                      <Input
                        className={cn(
                          "w-full",
                          !!errors.name
                            ? "border-destructive focus-visible:ring-destructive"
                            : "",
                        )}
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Description</FormLabel>
                  <div className="col-span-3 flex flex-col gap-1">
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
                  </div>
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
