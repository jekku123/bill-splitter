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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addGroupMemberAction } from "@/lib/actions/group-actions";
import { cn } from "@/lib/utils";
import { MemberFormValues, memberFormSchema } from "@/lib/zod/member-form";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function CreateGroupMemberDialog({
  groupId,
}: {
  groupId: number;
}) {
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
    const result = await addGroupMemberAction({ values, groupId });

    if (!result.success) {
      const { errors } = result;

      if (errors?.name) {
        form.setError("username", {
          type: "server",
          message: errors.name,
        });
      }
      if (errors?.message) {
        toast.error(errors.message);
      }
      return;
    }

    toast("Member added");
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <span className="">Add Member</span>
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
                <FormItem className="grid w-full grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <div className="col-span-3 flex flex-col gap-1">
                    <FormControl>
                      <Input
                        className={cn(
                          "",
                          !!errors.username
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
            <div className="mt-2 flex w-full justify-end gap-4">
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
