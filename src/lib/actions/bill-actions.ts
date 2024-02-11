"use server";

import { BillFormSchema } from "@/components/create-bill";
import { revalidatePath } from "next/cache";
import {
  deleteBill,
  insertBill,
  insertPayment,
  insertShare,
} from "../../drizzle/data-access";
import { NewBill } from "../../drizzle/schema";

export async function createBill(values: BillFormSchema, groupId: number) {
  const billData: NewBill = {
    groupId: groupId,
    title: values.title,
    description: values.description,
    amount: values.amount,
  };

  try {
    const newBill = await insertBill(billData);

    if (!newBill.at(0)) {
      return {
        data: undefined,
        success: false,
        error: "Could not create bill at this time. Please try again later.",
      };
    }

    values.payments.forEach(async (payment) => {
      await insertPayment({
        billId: newBill[0].billId,
        payerId: Number(payment.payerId),
        amount: payment.amount,
      });
    });

    values.shares.forEach(async (share) => {
      await insertShare({
        billId: newBill[0].billId,
        groupMemberId: Number(share.groupMemberId),
        amount: share.amount,
      });
    });

    revalidatePath(`/groups/${groupId}`);

    return {
      data: newBill[0],
      success: true,
      error: undefined,
    };
  } catch (error) {
    return {
      data: undefined,
      success: false,
      error: "Could not create bill at this time. Please try again later.",
    };
  }
}

export async function removeBill(billId: number) {
  try {
    const res = await deleteBill(billId);

    if (!res.at(0)) {
      return {
        success: false,
        error: "Could not delete bill at this time. Please try again later.",
      };
    }

    revalidatePath(`/groups/${res[0].groupId}`);

    return {
      success: true,
      error: undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: "Could not delete bill at this time. Please try again later.",
    };
  }
}
