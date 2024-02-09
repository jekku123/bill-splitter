"use server";

import { GroupFormValues } from "@/components/create-group";
import { revalidatePath } from "next/cache";

import {
  deleteGroup,
  getGroupsByUser,
  insertGroup,
  insertGroupMember,
} from "../../drizzle/data-access";
import { NewGroup } from "../../drizzle/schema";

export async function createGroup(userId: string, values: GroupFormValues) {
  const newGroup: NewGroup = {
    creatorId: parseInt(userId),
    title: values.name,
    description: values.description,
  };

  try {
    const group = await insertGroup(newGroup);

    if (!group.at(0)) {
      return {
        success: false,
        errors: {
          message:
            "Could not create group at this time. Please try again later.",
        },
      };
    }

    const newGroupMember = await insertGroupMember({
      username: "You",
      groupId: group[0].id,
      userId: parseInt(userId),
    });

    if (!newGroupMember.at(0)) {
      return {
        success: false,
        errors: {
          message:
            "Could not create group at this time. Please try again later.",
        },
      };
    }

    revalidatePath("/groups");

    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        message: "Could not create group at this time. Please try again later.",
      },
    };
  }
}

export async function getUsersGroups(userId: number) {
  try {
    const groups = await getGroupsByUser(userId);

    if (!groups.at(0)) return null;

    return groups;
  } catch (error) {
    console.error("error", error);
    return null;
  }
}

export async function removeGroup(groupId: number) {
  try {
    await deleteGroup(groupId);
    revalidatePath("/groups");
    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        message: "Could not delete group at this time. Please try again later.",
      },
    };
  }
}

export async function addGroupMember({
  username,
  groupId,
}: {
  username: string;
  groupId: number;
}) {
  try {
    const newGroupMember = await insertGroupMember({
      username,
      groupId,
    });

    if (!newGroupMember) {
      return {
        success: false,
        errors: {
          message:
            "Could not add user to group at this time. Please try again later.",
        },
      };
    }

    revalidatePath(`/groups`);

    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: {
        message:
          "Could not add user to group at this time. Please try again later.",
      },
    };
  }
}
