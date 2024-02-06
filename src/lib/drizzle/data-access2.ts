import { and, eq } from "drizzle-orm";
import { db } from ".";
import {
  GroupMember,
  NewGroup,
  NewGroupMember,
  NewUser,
  User,
  groupMembers,
  groups,
  users,
} from "./schema";

/**
 * This file contains the data access functions for the application.
 * These functions are used to only interact with the database.
 */

export {
  createUser,
  deleteGroup,
  deleteGroupMember,
  getGroupBills,
  getGroupById,
  getGroupMembers,
  getUserByEmail,
  getUserById,
  getUserGroups,
  insertGroup,
  insertGroupMember,
};

async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

async function getUserById(userId: number) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

async function createUser(user: NewUser): Promise<User[]> {
  return await db.insert(users).values(user).returning();
}

async function getUserGroups(userId: string) {
  return await db
    .select()
    .from(groups)
    .where(eq(groups.createdBy, parseInt(userId)));
}

async function insertGroup(group: NewGroup) {
  return await db.insert(groups).values(group).returning();
}

async function deleteGroup(groupId: number) {
  return await db.delete(groups).where(eq(groups.id, groupId)).returning();
}

async function insertGroupMember({ userId, groupId }: NewGroupMember) {
  return await db.insert(groupMembers).values({ groupId, userId }).returning();
}

async function getGroupMembers(groupId: number) {
  return await db
    .select()
    .from(groupMembers)
    .where(eq(groupMembers.groupId, groupId));
}

async function deleteGroupMember({ userId, groupId }: GroupMember) {
  return await db
    .delete(groupMembers)
    .where(
      and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)),
    )
    .returning();
}

async function getGroupById(groupId: number) {
  return await db.select().from(groups).where(eq(groups.id, groupId));
}

async function getGroupBills(groupId: number) {
  return await db.select().from(groups).where(eq(groups.id, groupId));
}
