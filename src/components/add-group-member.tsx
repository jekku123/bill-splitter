"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { addGroupMemberAction } from "@/lib/actions/group-actions";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const memberFormSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Please enter a name",
    })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, {
      message: "Name must be less than 20 characters",
    }),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;

export default function AddGroupMemberDialog({ groupId }: { groupId: number }) {
  const [open, setOpen] = useState(false);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: MemberFormValues) {
    const username = values.username;

    const result = await addGroupMemberAction({ username, groupId });

    if (!result.success) {
      toast("Failed to add member");
      return;
    }

    toast("Member added");
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <span className="">Add Member</span>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full">
            <Plus />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>Add member to the group</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className={cn(
                        "",
                        !!errors.username
                          ? "border-destructive focus-visible:ring-destructive"
                          : "",
                      )}
                      autoFocus
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end gap-4">
              <Button
                variant="default"
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                Add Member
                {isSubmitting && (
                  <Icons.spinner className="ml-2 animate-spin" />
                )}
              </Button>
              <DialogClose asChild>
                <Button onClick={() => reset()} variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
