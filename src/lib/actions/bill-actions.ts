"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import {
  deleteBill,
  insertBill,
  insertPayment,
  insertShare,
} from "../../drizzle/data-access";
import { NewBill } from "../../drizzle/schema";
import { BillFormValues, billFormSchema } from "../zod/bill-form";

// TODO: add Payments and Shares zod error types
export interface BillActionResponse {
  success: boolean;
  errors?: {
    title?: string;
    description?: string;
    message?: string;
  };
}

export async function createBill(
  values: BillFormValues,
  groupId: number,
): Promise<BillActionResponse> {
  try {
    const validatedValues = billFormSchema.parse(values);

    const billData: NewBill = {
      groupId: groupId,
      title: validatedValues.title,
      description: validatedValues.description,
      amount: validatedValues.payments
        .reduce((acc, payment) => acc + parseFloat(payment.amount), 0)
        .toString(),
    };

    const newBill = await insertBill(billData);

    if (!newBill.at(0)) {
      return {
        success: false,
        errors: {
          message:
            "Could not create bill at this time. Please try again later.",
        },
      };
    }

    for (const payment of values.payments) {
      await insertPayment({
        billId: newBill[0].billId,
        payerId: Number(payment.payerId),
        amount: payment.amount,
      });
    }

    for (const share of values.shares) {
      await insertShare({
        billId: newBill[0].billId,
        groupMemberId: Number(share.groupMemberId),
        amount: share.amount,
      });
    }

    revalidatePath(`/groups/${groupId}`);

    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError = error as ZodError;
      const errorMap = zodError.flatten().fieldErrors;

      return {
        success: false,
        errors: {
          title: errorMap["title"]?.[0] ?? "",
          description: errorMap["description"]?.[0] ?? "",
          // TODO: add payments and shares errors
        },
      };
    }

    return {
      success: false,
      errors: {
        message: "Could not create bill at this time. Please try again later.",
      },
    };
  }
}

export async function removeBill(billId: number): Promise<BillActionResponse> {
  try {
    const res = await deleteBill(billId);

    if (!res.at(0)) {
      return {
        success: false,
        errors: {
          message:
            "Could not delete bill at this time. Please try again later.",
        },
      };
    }

    revalidatePath(`/groups/${res[0].groupId}`);

    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        message: "Could not delete bill at this time. Please try again later.",
      },
    };
  }
}
