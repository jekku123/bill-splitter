"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DialogClose } from "@radix-ui/react-dialog";

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
import { BillActionResponse, createBill } from "@/lib/actions/bill-actions";
import { BillFormValues, billFormSchema } from "@/lib/zod/bill-form";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
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

// TODO HEHE

export function CreateBillForm({
  group,
  setOpen,
}: {
  group: GroupDataProps;
  setOpen: (open: boolean) => void;
}) {
  const { groupMembers } = group;

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      title: "",
      description: "",
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

  async function onSubmit(values: BillFormValues) {
    const groupId = group?.id!;

    toast.promise(
      async () => {
        await createBill(values, groupId);
      },
      {
        loading: "Loading...",
        success: () => {
          reset();
          setOpen(false);
          return `Bill has been added`;
        },
        error: (data: BillActionResponse) => {
          const { errors } = data;

          if (errors?.title) {
            form.setError("title", {
              type: "server",
              message: errors.title,
            });
          }
          if (errors?.description) {
            form.setError("description", {
              type: "server",
              message: errors.description,
            });
          }
          if (errors?.message) {
            toast.error(errors.message);
          }

          // TODO Payments and Shares server errors

          return "Could not create bill at this time. Please try again later.";
        },
      },
    );
  }

  const totalCost = watch("payments", []).reduce(
    (acc, payment) =>
      acc + (payment.amount !== "" ? parseFloat(payment.amount) : 0),
    0,
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem className="grid w-full grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Title</FormLabel>
              <div className="col-span-3 flex flex-col gap-1">
                <FormControl>
                  <Input
                    className={cn(
                      "w-full",
                      !!errors.title
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
            <FormItem className="grid w-full grid-cols-4 items-center gap-4">
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

        <Separator />

        {/* PAYMENTS */}

        <div className="flex items-center justify-between gap-4">
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
            <span className="sr-only">Add Payment</span>
          </Button>
        </div>

        {paymentFields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="grid w-full grid-cols-4 items-start gap-4"
            >
              <FormField
                control={control}
                name={`payments.${index}.payerId` as const}
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose sharer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groupMembers.map((member) => {
                          return (
                            <SelectItem
                              disabled={watch().payments?.some(
                                (payment) =>
                                  payment.payerId === member.id.toString(),
                              )}
                              key={member.id}
                              value={member.id + ""}
                            >
                              {member.username}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`payments.${index}.amount` as const}
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <div className="relative flex flex-col gap-1">
                      <FormControl>
                        <Input
                          disabled={watch().payments![index].payerId === ""}
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
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          );
        })}

        <Separator />

        {/* SHARES */}

        <div className="flex items-center justify-between gap-4">
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
            <span className="sr-only">Add Sharer</span>
          </Button>
        </div>

        {shareFields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="grid w-full grid-cols-4 items-start gap-4"
            >
              <FormField
                control={control}
                name={`shares.${index}.groupMemberId` as const}
                render={({ field }) => (
                  <FormItem className="col-span-1">
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
                            disabled={watch().shares?.some(
                              (share) =>
                                share.groupMemberId === member.id.toString(),
                            )}
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
                  <FormItem className="relative col-span-3 flex flex-col gap-1">
                    <div className="relative flex flex-col gap-1">
                      <FormControl>
                        <Input
                          disabled={watch().shares![index].groupMemberId === ""}
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
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          );
        })}

        <Separator />

        <TypographyH4 className="text-2xl">
          Total Cost: {totalCost}
        </TypographyH4>
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
            {isSubmitting && <Icons.spinner className="ml-2 animate-spin" />}
          </Button>
          <DialogClose asChild>
            <Button type="button" onClick={() => reset()} variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}
