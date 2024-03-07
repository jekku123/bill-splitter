"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GroupDataProps } from "@/drizzle/data-access";
import { BillActionResponse, createBill } from "@/lib/actions/bill-actions";

import { toast } from "sonner";
import { Separator } from "../../../components/ui/separator";
import { Textarea } from "../../../components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

export const billFormSchema = z
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
    description: z.string(),
    amount: z.string().min(1, { message: "Please enter a total" }),
    shareStyle: z.enum(["even", "custom"]),
    payments: z.array(
      z.object({
        payerId: z.string(),
        amount: z.string(),
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

      const totalPayments = data.payments.reduce(
        (acc, payment) => acc + parseFloat(payment.amount),
        0,
      );

      return totalShares === totalPayments;
    },
    {
      message: "Total shares must be equal to total payments",
      path: ["shares", 0, "amount"],
    },
  );
export type BillFormValues = z.infer<typeof billFormSchema>;

// TODO HEHE

export function CreateBillForm2({
  group,
  setOpen,
}: {
  group: GroupDataProps;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      shareStyle: "even",
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
      acc +
      (payment.amount !== "" || payment.amount !== undefined
        ? parseFloat(payment.amount)
        : 0),
    0,
  );

  console.log(totalCost);

  console.log(watch());

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
              <FormLabel className="text-right">
                <div className="flex flex-col items-center justify-center">
                  <p>Description</p>
                  <span>(optional)</span>
                </div>
              </FormLabel>
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
        {/* <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem className="grid w-full grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Amount</FormLabel>
              <div className="col-span-3 flex flex-col gap-1">
                <FormControl>
                  <Input
                    type="number"
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

        <Separator /> */}

        <FormField
          control={form.control}
          name="shareStyle"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-x-4 space-y-0">
              <FormLabel className="text-2xl">Share Style</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-3"
                >
                  <FormItem className="flex space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="even" />
                    </FormControl>
                    <FormLabel className="font-normal">Even</FormLabel>
                  </FormItem>
                  <FormItem className="flex h-full  space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="custom" />
                    </FormControl>
                    <FormLabel className="font-normal">Custom</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />

        {/* PAYMENTS */}
        <Table>
          <TableCaption>Splitting bills is easy and fun!</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.groupMembers.map((groupMember, index) => (
              <TableRow key={groupMember.id}>
                <TableCell>
                  <Checkbox
                    checked={
                      shareFields.some(
                        (share) =>
                          share.groupMemberId === groupMember.id.toString(),
                      ) || false
                    }
                    onCheckedChange={(checked) => {
                      checked
                        ? appendShare({
                            groupMemberId: groupMember.id.toString(),
                            amount: "",
                          })
                        : removeShare(
                            shareFields.findIndex(
                              (share) =>
                                share.groupMemberId ===
                                groupMember.id.toString(),
                            ),
                          );
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {groupMember.username}
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`payments.${index}.amount` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            className={cn(
                              "",
                              !!errors.payments?.[index]?.amount
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
                </TableCell>
                <TableCell>
                  <FormField
                    control={control}
                    name={`shares.${index}.amount` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={watch("shareStyle") === "even"}
                            className={cn(
                              "",
                              !!errors.shares?.[index]?.amount
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{totalCost}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* <div className="flex items-center justify-between gap-4">
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
        })} */}

        {/* 
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
        })} */}

        <Separator />

        {/*    <TypographyH4 className="text-2xl">
          Total Cost: {totalCost}
        </TypographyH4> */}
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
            Add Bill
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
