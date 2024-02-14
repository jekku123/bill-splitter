"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

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
import { cn } from "@/lib/utils";

import { GroupDataProps } from "@/drizzle/data-access";
import { createBill } from "@/lib/actions/bill-actions";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { TypographyH4 } from "./ui/typography";

const billFormSchema = z
  .object({
    title: z
      .string()
      .min(1, {
        message: "Please enter a name",
      })
      .min(3, { message: "Name must be at least 3 characters" })
      .max(20, {
        message: "Name must be less than 30 characters",
      }),
    description: z.string().min(1, { message: "Please enter a description" }),
    amount: z.string().min(1, { message: "Please enter an amount" }),
    payments: z.array(
      z.object({
        payerId: z.string(),
        amount: z.string().min(1, { message: "Please enter an amount" }),
      }),
    ),
    shares: z.array(
      z.object({
        groupMemberId: z.string(),
        amount: z.string().min(1, { message: "Please enter an amount" }),
      }),
    ),
  })
  .refine(
    (data) => {
      const totalShares = data.shares.reduce(
        (acc, share) => acc + parseFloat(share.amount),
        0,
      );

      return totalShares === parseFloat(data.amount);
    },
    {
      message: "Total payments must be equal to the amount",
      path: ["amount"],
    },
  );
export type BillFormSchema = z.infer<typeof billFormSchema>;

export default function AddBillDialog({ group }: { group: GroupDataProps }) {
  const { groupMembers } = group;

  const [open, setOpen] = useState(false);

  const form = useForm<BillFormSchema>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      payments: [],
      shares: [],
    },
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control,
    name: "payments",
  });

  const {
    fields: shareFields,
    append: appendShare,
    remove: removeShare,
  } = useFieldArray({
    control,
    name: "shares",
  });

  async function onSubmit(values: BillFormSchema) {
    const groupId = group?.id!;

    toast.promise(
      async () => {
        await createBill({ ...values }, groupId);
      },
      {
        loading: "Loading...",
        success: () => {
          reset();
          setOpen(false);
          return `Bill has been added`;
        },
        error: "Error while adding bill",
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <span className="">Add Bill</span>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full">
            <Plus />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Bill</DialogTitle>
          <DialogDescription>
            Add a bill to group {group?.title}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <div className="grid w-full grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Title</FormLabel>
                    <FormControl>
                      <Input
                        className={cn(
                          "col-span-3",
                          !!errors.title
                            ? "border-destructive focus-visible:ring-destructive"
                            : "",
                        )}
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <div className="grid w-full grid-cols-4 items-center gap-4">
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
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <div className="grid w-full grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className={cn(
                          "col-span-3",
                          !!errors.amount
                            ? "border-destructive focus-visible:ring-destructive"
                            : "",
                        )}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex gap-4">
              <TypographyH4 className="text-2xl">Payments</TypographyH4>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  appendPayment({
                    payerId: "",
                    amount: "",
                  })
                }
              >
                <Plus />
                <span className="sr-only">Add Member</span>
              </Button>
            </div>

            {/* PAYMENTS */}

            {paymentFields.map((field, index) => {
              return (
                <div key={field.id}>
                  <div className="grid w-full grid-cols-4 items-center gap-4">
                    <FormField
                      control={control}
                      name={`payments.${index}.payerId` as const}
                      render={({ field }) => (
                        <FormItem className="col-span-1 self-center ">
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose sharer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {groupMembers.map((member, idx) => (
                                <SelectItem
                                  key={member.id}
                                  value={member.id + ""}
                                >
                                  {member.username}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`payments.${index}.amount` as const}
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <div className="relative flex gap-4">
                            <FormControl>
                              <Input
                                disabled={
                                  watch().payments![index].payerId === ""
                                }
                                type="number"
                                className={cn(
                                  "w-full",
                                  !!errors.payments?.[index]?.amount
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : "",
                                )}
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-0 shrink-0 rounded-full"
                              onClick={() => removePayment(index)}
                            >
                              <X />
                              <span className="sr-only">Remove Payment</span>
                            </Button>
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              );
            })}

            <Separator />

            <div className="flex gap-4">
              <TypographyH4 className="text-2xl">Shares</TypographyH4>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  appendShare({
                    groupMemberId: "",
                    amount: "",
                  })
                }
              >
                <Plus />
                <span className="sr-only">Add Member</span>
              </Button>
            </div>

            {shareFields.map((field, index) => {
              return (
                <div key={field.id}>
                  <div className="grid w-full grid-cols-4 items-center gap-4">
                    <FormField
                      control={control}
                      name={`shares.${index}.groupMemberId` as const}
                      render={({ field }) => (
                        <FormItem className="col-span-1 self-center ">
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose sharer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {groupMembers.map((member, idx) => (
                                <SelectItem
                                  key={member.id}
                                  value={member.id + ""}
                                >
                                  {member.username}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`shares.${index}.amount` as const}
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <div className="relative flex gap-4">
                            <FormControl>
                              <Input
                                disabled={
                                  watch().shares![index].groupMemberId === ""
                                }
                                type="number"
                                className={cn(
                                  "w-full",
                                  !!errors.shares?.[index]?.amount
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : "",
                                )}
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-0 shrink-0 rounded-full"
                              onClick={() => removeShare(index)}
                            >
                              <X />
                              <span className="sr-only">Remove Share</span>
                            </Button>
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex w-full justify-end gap-4">
              <Button type="button" onClick={() => reset()} variant="outline">
                Clear
              </Button>
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
                <Button
                  type="button"
                  onClick={() => reset()}
                  variant="secondary"
                >
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
