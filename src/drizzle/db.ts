"use server";

import {
  GroupDataProps,
  getGroupData,
  getGroupsByUser,
} from "../drizzle/data-access";

export async function getGroup(groupId: number) {
  try {
    const groups = await getGroupData(groupId);
    return groups;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

export async function getGroupsByUserId(
  userId: number,
): Promise<GroupDataProps[] | null> {
  try {
    const groups = await getGroupsByUser(userId);
    if (!groups) return null;
    return groups;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}
