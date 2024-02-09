import { and, eq } from "drizzle-orm";
import { db } from ".";
import {
  Bill,
  Group,
  GroupMember,
  NewBill,
  NewGroup,
  NewGroupMember,
  NewPayment,
  NewShare,
  NewUser,
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
  deleteUser,
  getBills,
  getBillsByGroup,
  getGroupById,
  getGroupData,
  getGroupMemberById,
  getGroupMembers,
  getGroups,
  getGroupsByUser,
  getPayments,
  getPaymentsByBill,
  getPaymentsByGroupMember,
  getSharesByBill,
  getSharesByGroupMember,
  getUserByEmail,
  getUserById,
  getUsers,
  insertBill,
  insertGroup,
  insertGroupMember,
  insertPayment,
  insertShare,
  insertUser,
  updateBill,
  updateGroup,
  updateGroupMember,
  updatePayment,
  updateShare,
  updateUser,
};

// User data access functions

async function insertUser(user: NewUser): Promise<User[]> {
  return await db.insert(users).values(user).returning();
}

async function getUsers() {
  return await db.query.users.findMany();
}

async function getUserByEmail(email: string): Promise<User | undefined> {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

async function getUserById(userId: number) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

async function deleteUser(userId: number) {
  return await db.delete(users).where(eq(users.id, userId)).returning();
}

async function updateUser(userId: number, user: NewUser) {
  return await db
    .update(users)
    .set(user)
    .where(eq(users.id, userId))
    .returning();
}

// Group data access functions

async function insertGroup(group: NewGroup) {
  return await db.insert(groups).values(group).returning();
}

async function getGroups() {
  return await db.query.groups.findMany();
}

export interface GroupData extends Group {
  groupMembers: GroupMember[];
}

async function getGroupData(groupId: number): Promise<GroupData> {
  const res = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    with: {
      groupMembers: true,
    },
  });

  if (!res) {
    throw new Error(`Group with ID ${groupId} not found`);
  }

  return res;
}

async function getGroupsByUser(userId: number) {
  return await db.query.groups.findMany({
    where: eq(groups.creatorId, userId),
  });
}

async function getGroupById(groupId: number) {
  return await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
}

async function updateGroup(groupId: number, group: NewGroup) {
  return await db
    .update(groups)
    .set(group)
    .where(eq(groups.id, groupId))
    .returning();
}

async function deleteGroup(groupId: number) {
  return await db.delete(groups).where(eq(groups.id, groupId)).returning();
}

// Group member data access functions

async function insertGroupMember(groupMember: NewGroupMember) {
  return await db.insert(groupMembers).values(groupMember).returning();
}

async function getGroupMembers(groupId: number) {
  return await db.query.groupMembers.findMany({
    where: eq(groupMembers.groupId, groupId),
  });
}

async function getGroupMemberById(groupId: number, groupMemberId: number) {
  return await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.id, groupMemberId),
    ),
  });
}

async function updateGroupMember(groupId: number, groupMember: GroupMember) {
  return await db
    .update(groupMembers)
    .set(groupMember)
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.id, groupMember.id),
      ),
    )
    .returning();
}

async function deleteGroupMember(groupId: number, groupMemberId: number) {
  return await db
    .delete(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.id, groupMemberId),
      ),
    )
    .returning();
}

// Bill data access functions

async function insertBill(bill: NewBill) {
  return await db.insert(bills).values(bill).returning();
}

async function getBills() {
  return await db.query.bills.findMany();
}

async function getBillsByGroup(groupId: number): Promise<Bill[]> {
  return await db.query.bills.findMany({
    where: eq(bills.groupId, groupId),
  });
}

async function updateBill(billId: number, bill: NewBill) {
  return await db
    .update(bills)
    .set(bill)
    .where(eq(bills.id, billId))
    .returning();
}

async function deleteBill(billId: number) {
  return await db.delete(bills).where(eq(bills.id, billId)).returning();
}

// Payment data access functions

async function insertPayment(payment: NewPayment) {
  return await db.insert(payments).values(payment).returning();
}

async function getPayments() {
  return await db.query.payments.findMany();
}

async function getPaymentsByGroupMember(groupMemberId: number) {
  return await db.query.payments.findMany({
    where: eq(payments.payerId, groupMemberId),
  });
}

async function getPaymentsByBill(billId: number) {
  return await db.query.payments.findMany({
    where: eq(payments.billId, billId),
  });
}

async function updatePayment(paymentId: number, payment: NewPayment) {
  return await db
    .update(payments)
    .set(payment)
    .where(eq(payments.id, paymentId))
    .returning();
}

async function deletePayment(paymentId: number) {
  return await db
    .delete(payments)
    .where(eq(payments.id, paymentId))
    .returning();
}

async function insertShare(share: NewShare) {
  return db.insert(shares).values(share).returning();
}

async function getSharesByBill(billId: number) {
  return db.query.shares.findMany({
    where: eq(shares.billId, billId),
  });
}

async function getSharesByGroupMember(groupMemberId: number) {
  return db.query.shares.findMany({
    where: eq(shares.groupMemberId, groupMemberId),
  });
}

async function updateShare(shareId: number, share: NewShare) {
  return db.update(shares).set(share).where(eq(shares.id, shareId)).returning();
}

async function deleteShare(shareId: number) {
  return db.delete(shares).where(eq(shares.id, shareId)).returning();
}

async function getPaymentsByUser(userId: number) {
  return db.query.payments.findMany({
    where: eq(payments.payerId, userId),
  });
}
