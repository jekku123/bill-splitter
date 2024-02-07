"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
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

import { GroupData } from "@/lib/drizzle/data-access2";
import { Plus, X } from "lucide-react";
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

const billFormSchema = z.object({
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
  paidBy: z.string().min(1, { message: "Please enter a name" }),
  shares: z.array(
    z.object({
      userId: z.number(),
      amount: z.number().min(1, { message: "Please enter an amount" }),
    }),
  ),
});

export type BillFormValues = z.infer<typeof billFormSchema>;

export default function AddBillDialog({ groupData }: { groupData: GroupData }) {
  const { group, members } = groupData;
  const [open, setOpen] = useState(false);

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      paidBy: "",
      shares: [],
    },
  });

  const {
    reset,
    watch,
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "shares", // unique name for your Field Array
    },
  );

  async function onSubmit(values: BillFormValues) {
    console.log("VALUES:", values);

    // const username = values.username;

    // const result = await addGroupMember({ username, groupId });

    // if (!result.success) {
    //   toast("Failed to add member", {});
    // }

    // toast("Member added", {});
    // setOpen(false);
  }

  console.log(watch());

  const sharers2 = members.filter((member) => {
    return watch().paidBy !== member.username;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full">
          <Plus />
          <span className="sr-only">Add Bill</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Bill</DialogTitle>
          {/* <DialogDescription>Add a bill!</DialogDescription> */}
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
            <FormField
              control={control}
              name="paidBy"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <div className="grid w-full grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Paidby</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={cn(
                            "col-span-3",
                            !!errors.paidBy
                              ? "border-destructive bg-red-400 focus-visible:ring-destructive"
                              : "",
                          )}
                        >
                          <SelectValue placeholder="Choose payer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.username}>
                            {member.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="flex gap-4">
              <h2 className="text-2xl">Shares</h2>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() =>
                  append({
                    userId: 1,
                    amount: 0,
                  })
                }
              >
                <Plus />
                <span className="sr-only">Add Member</span>
              </Button>
            </div>

            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <FormField
                    control={control}
                    name={`shares.${index}.amount` as const}
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <div className="grid w-full grid-cols-4 items-center gap-4">
                          <FormLabel className="col-span-1 text-right">
                            Description
                          </FormLabel>
                          <div className="col-span-3 flex gap-4">
                            <FormControl>
                              <Input
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
                              variant="outline"
                              className="shrink-0 rounded-full"
                              onClick={() => remove(index)}
                            >
                              <X />
                              <span className="sr-only">Remove Sharer</span>
                            </Button>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <section className={"section"} key={field.id}>
                    <input
                      placeholder="name"
                      {...register(`shares.${index}.amount` as const, {
                        required: true,
                      })}
                      className={errors?.shares?.[index]?.amount ? "error" : ""}
                    />
                    <button type="button" onClick={() => remove(index)}>
                      DELETE
                    </button>
                  </section> */}
                </div>
              );
            })}

            <FormField
              control={control}
              name="shares"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <div className="grid w-full grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Add share</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className={"col-span-2"}>
                          <SelectValue placeholder="Choose sharer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.username}>
                            {member.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Plus />
                      <span className="sr-only">Add Member</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* HERE */}

            <div className="flex w-full justify-end gap-4">
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

{
  /* <FormField
control={form.control}
name="shares"
render={() => (
  <FormItem>
    <div className="mb-4">
      <FormLabel className="text-base">Shares</FormLabel>
      <FormDescription>Put shares here.</FormDescription>
    </div>
    {members.map((member, idx) => (
      <FormField
        key={member.id}
        control={form.control}
        name="payments"
        render={({ field }) => {
          return (
            <FormItem
              key={member.id}
              className="flex flex-row items-start space-x-3 space-y-0"
            >
              <FormControl>
                <Checkbox
                  checked={field.value?.some(
                    (value) => value.id === member.id,
                  )}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([
                          ...field.value,
                          {
                            id: member.id,
                            amount: 0,
                          },
                        ])
                      : field.onChange(
                          field.value?.filter(
                            (value) => value.id !== member.id,
                          ),
                        );
                  }}
                />
              </FormControl>
              <FormControl>
                <Input
                  className={cn(
                    "col-span-3",
                    !!errors.payments
                      ? "border-destructive focus-visible:ring-destructive"
                      : "",
                  )}
                  type="number"
                  value={
                    field.value.find(
                      (value) => value.id === member.id,
                    )?.amount || ""
                  }
                  onChange={(e) => {
                    const updatedPayments = field.value.map(
                      (value) =>
                        value.id === member.id
                          ? {
                              ...value,
                              amount: parseFloat(
                                e.target.value || "0",
                              ),
                            }
                          : value,
                    );
                    field.onChange(updatedPayments);
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal">
                {member.username}
              </FormLabel>
            </FormItem>
          );
        }}
      />
    ))}
    <FormMessage />
  </FormItem>
)}
/> */
}
