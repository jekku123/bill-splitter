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
