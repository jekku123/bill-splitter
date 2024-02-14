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
export type BillFormValues = z.infer<typeof billFormSchema>;
