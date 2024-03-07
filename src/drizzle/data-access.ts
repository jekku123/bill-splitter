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

// User data access functions

export async function insertUser(user: NewUser): Promise<{ id: number }[]> {
  return await db.insert(users).values(user).returning({
    id: users.id,
  });
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function getUserById(userId: number): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function updateUserById(
  userId: number,
  user: NewUser,
): Promise<User[]> {
  return await db
    .update(users)
    .set(user)
    .where(eq(users.id, userId))
    .returning();
}

// Group data access functions

export async function insertGroup(group: NewGroup): Promise<{ id: number }[]> {
  return await db.insert(groups).values(group).returning({
    id: groups.id,
  });
}

export async function getGroupData(groupId: number) {
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

export async function getGroupsByUser(
  userId: number,
): Promise<GroupDataProps[] | void> {
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

  if (!res.at(0)) {
    throw new Error("No groups found");
  }

  return res;
}

export async function updateGroup(
  groupId: number,
  group: NewGroup,
): Promise<void> {
  await db.update(groups).set(group).where(eq(groups.id, groupId));
}

export async function deleteGroup(groupId: number): Promise<void> {
  await db.delete(groups).where(eq(groups.id, groupId));
}

// Group member data access functions

export async function insertGroupMember(
  groupMember: NewGroupMember,
): Promise<void> {
  await db.insert(groupMembers).values(groupMember);
}

export async function deleteGroupMember(
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

export async function insertBill(bill: NewBill): Promise<{ billId: number }[]> {
  return await db.insert(bills).values(bill).returning({
    billId: users.id,
  });
}

// TODO: POISTA
export async function getBillsByGroup(groupId: number): Promise<Bill[]> {
  return await db.query.bills.findMany({
    where: eq(bills.groupId, groupId),
  });
}

export async function deleteBill(billId: number): Promise<
  {
    groupId: number;
  }[]
> {
  return await db.delete(bills).where(eq(bills.id, billId)).returning({
    groupId: groups.id,
  });
}

// Payment data access functions

export async function insertPayment(payment: NewPayment): Promise<void> {
  await db.insert(payments).values(payment);
}

export async function insertPayments(paymentArr: NewPayment[]): Promise<void> {
  await db.insert(payments).values(paymentArr);
}

export async function getPaymentsByGroupMember(
  groupMemberId: number,
): Promise<Payment[]> {
  return await db.query.payments.findMany({
    where: eq(payments.payerId, groupMemberId),
  });
}

export async function getPaymentsByBill(billId: number): Promise<Payment[]> {
  return await db.query.payments.findMany({
    where: eq(payments.billId, billId),
  });
}

export async function deletePayment(paymentId: number): Promise<void> {
  await db.delete(payments).where(eq(payments.id, paymentId));
}

export async function insertShare(share: NewShare): Promise<void> {
  await db.insert(shares).values(share);
}

export async function insertShares(shareArr: NewShare[]): Promise<void> {
  await db.insert(shares).values(shareArr);
}

export async function getSharesByBill(billId: number): Promise<Share[]> {
  return db.query.shares.findMany({
    where: eq(shares.billId, billId),
  });
}

export async function getSharesByGroupMember(
  groupMemberId: number,
): Promise<Share[]> {
  return db.query.shares.findMany({
    where: eq(shares.groupMemberId, groupMemberId),
  });
}

export async function deleteShare(shareId: number): Promise<void> {
  await db.delete(shares).where(eq(shares.id, shareId));
}
