import { reduceMemberTotals } from "@/lib/utils";
import { MemberTotals } from "@/types/types";
import { and, eq } from "drizzle-orm";
import { db } from ".";
import {
  Bill,
  NewBill,
  NewGroup,
  NewGroupMember,
  NewPayment,
  NewShare,
  NewUser,
  Payment,
  Share,
  User,
  bills,
  groupMembers,
  groups,
  payments,
  shares,
  users,
} from "./schema";

/**
 * This file contains the data access functions for the application.
 * These functions are used to only interact with the database.
 */

export {
  deleteBill,
  deleteGroup,
  deleteGroupMember,
  deletePayment,
  deleteShare,
  getBillsByGroup,
  getGroupData,
  getGroupsByUser,
  getMemberTotals,
  getPaymentsByBill,
  getPaymentsByGroupMember,
  getSharesByBill,
  getSharesByGroupMember,
  getUserByEmail,
  getUserById,
  insertBill,
  insertGroup,
  insertGroupMember,
  insertPayment,
  insertShare,
  insertUser,
  updateGroup,
  updateUser,
};

// User data access functions

async function insertUser(user: NewUser): Promise<void> {
  await db.insert(users).values(user);
}

async function getUserByEmail(email: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

async function getUserById(userId: number): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

async function updateUser(userId: number, user: NewUser): Promise<void> {
  await db.update(users).set(user).where(eq(users.id, userId));
}

// Group data access functions

async function insertGroup(group: NewGroup): Promise<{ id: number }[]> {
  return await db.insert(groups).values(group).returning({
    id: groups.id,
  });
}

async function getGroupData(groupId: number) {
  const res = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    with: {
      groupMembers: {
        with: {
          payments: true,
          shares: true,
        },
      },

      bills: {
        with: {
          payments: true,
          shares: true,
        },
      },
    },
  });

  if (!res) {
    throw new Error("No group found");
  }

  return res;
}

export type GroupDataProps = Awaited<ReturnType<typeof getGroupData>>;

async function getGroupsByUser(userId: number): Promise<GroupDataProps[]> {
  const res = await db.query.groups.findMany({
    where: eq(groups.creatorId, userId),

    with: {
      groupMembers: {
        with: {
          payments: true,
          shares: true,
        },
      },

      bills: {
        with: {
          payments: true,
          shares: true,
        },
      },
    },
  });

  return res;
}

async function updateGroup(groupId: number, group: NewGroup): Promise<void> {
  await db.update(groups).set(group).where(eq(groups.id, groupId));
}

async function deleteGroup(groupId: number): Promise<void> {
  await db.delete(groups).where(eq(groups.id, groupId));
}

// Group member data access functions

async function insertGroupMember(groupMember: NewGroupMember): Promise<void> {
  await db.insert(groupMembers).values(groupMember);
}

async function deleteGroupMember(
  groupId: number,
  groupMemberId: number,
): Promise<void> {
  await db
    .delete(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.id, groupMemberId),
      ),
    );
}

// Bill data access functions

async function insertBill(bill: NewBill): Promise<{ billId: number }[]> {
  return await db.insert(bills).values(bill).returning({
    billId: users.id,
  });
}

// TODO: POISTA
async function getBillsByGroup(groupId: number): Promise<Bill[]> {
  return await db.query.bills.findMany({
    where: eq(bills.groupId, groupId),
  });
}

async function deleteBill(billId: number): Promise<
  {
    groupId: number;
  }[]
> {
  return await db.delete(bills).where(eq(bills.id, billId)).returning({
    groupId: groups.id,
  });
}

// Payment data access functions

async function insertPayment(payment: NewPayment): Promise<void> {
  await db.insert(payments).values(payment);
}

async function getPaymentsByGroupMember(
  groupMemberId: number,
): Promise<Payment[]> {
  return await db.query.payments.findMany({
    where: eq(payments.payerId, groupMemberId),
  });
}

async function getPaymentsByBill(billId: number): Promise<Payment[]> {
  return await db.query.payments.findMany({
    where: eq(payments.billId, billId),
  });
}

async function deletePayment(paymentId: number): Promise<void> {
  await db.delete(payments).where(eq(payments.id, paymentId));
}

async function insertShare(share: NewShare): Promise<void> {
  await db.insert(shares).values(share);
}

async function getSharesByBill(billId: number): Promise<Share[]> {
  return db.query.shares.findMany({
    where: eq(shares.billId, billId),
  });
}

async function getSharesByGroupMember(groupMemberId: number): Promise<Share[]> {
  return db.query.shares.findMany({
    where: eq(shares.groupMemberId, groupMemberId),
  });
}

async function deleteShare(shareId: number): Promise<void> {
  await db.delete(shares).where(eq(shares.id, shareId));
}

async function getMemberTotals(groupId: number): Promise<MemberTotals[]> {
  const res = await db.query.groupMembers.findMany({
    where: eq(groupMembers.groupId, groupId),
    with: {
      payments: true,
      shares: true,
    },
  });

  return res.map((member) => reduceMemberTotals(member));
}