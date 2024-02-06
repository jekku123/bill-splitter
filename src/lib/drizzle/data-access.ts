"use server";

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

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  } catch (error) {
    console.error(
      "Error occurred while trying to find user by email in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function createUser(user: NewUser): Promise<User[]> {
  try {
    const newUser = await db.insert(users).values(user).returning();
    return newUser;
  } catch (error) {
    console.error(
      "Error occurred while trying to create a new user in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function getUserGroups(userId: string) {
  // TODO: Find out why not working
  // const response = await db.query.groups.findMany();

  try {
    const result = await db
      .select()
      .from(groups)
      .where(eq(groups.createdBy, parseInt(userId)));

    if (!result.at(0)) {
      return null;
    }
    return result;
  } catch (error) {
    console.error(
      "Error occurred while trying to get user groups in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function insertGroup(group: NewGroup) {
  try {
    return await db.insert(groups).values(group).returning();
  } catch (error) {
    console.error(
      "Error occurred while trying to create a new group in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function deleteGroup(groupId: number) {
  try {
    return await db.delete(groups).where(eq(groups.id, groupId)).returning();
  } catch (error) {
    console.error(
      "Error occurred while trying to delete a group in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function insertGroupMember(member: NewGroupMember) {
  const { userId, groupId } = member;

  try {
    return await db
      .insert(groupMembers)
      .values({ groupId, userId })
      .returning();
  } catch (error) {
    console.error(
      "Error occurred while trying to add a new group member in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function getGroupMembers(groupId: number) {
  try {
    const result = await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    if (!result.at(0)) {
      return null;
    }
    return result;
  } catch (error) {
    console.error(
      "Error occurred while trying to get group members in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function deleteGroupMember(member: GroupMember) {
  const { userId, groupId } = member;

  try {
    return await db
      .delete(groupMembers)
      .where(
        and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)),
      )
      .returning();
  } catch (error) {
    console.error(
      "Error occurred while trying to delete a group member in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function getGroupById(groupId: number) {
  try {
    const group = await db.select().from(groups).where(eq(groups.id, groupId));

    if (!group.at(0)) {
      return null;
    }

    return group[0];
  } catch (error) {
    console.error(
      "Error occurred while trying to find group by id in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function getGroupBills(groupId: number) {
  try {
    const result = await db.select().from(groups).where(eq(groups.id, groupId));

    if (!result.at(0)) {
      return null;
    }
    return result;
  } catch (error) {
    console.error(
      "Error occurred while trying to get group bills in data-access.ts",
      error,
    );
    throw error;
  }
}
