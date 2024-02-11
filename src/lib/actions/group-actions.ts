"use server";

import { GroupFormValues } from "@/components/create-group";
import { revalidatePath } from "next/cache";

import {
  deleteGroup,
  insertGroup,
  insertGroupMember,
} from "../../drizzle/data-access";
import { NewGroup } from "../../drizzle/schema";

export interface GroupActionResponse {
  success: boolean;
  errors?: {
    message: string;
  };
}

export async function createGroupAction(
  userId: string,
  values: GroupFormValues,
): Promise<GroupActionResponse> {
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

    await insertGroupMember({
      username: "You",
      groupId: group[0].id,
      userId: parseInt(userId),
    });

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

export async function removeGroupAction(
  groupId: number,
): Promise<GroupActionResponse> {
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

export async function addGroupMemberAction({
  username,
  groupId,
}: {
  username: string;
  groupId: number;
}): Promise<GroupActionResponse> {
  try {
    await insertGroupMember({
      username,
      groupId,
    });

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