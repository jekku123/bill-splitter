"use server";

import { GroupFormValues } from "@/components/create-group";
import { revalidatePath } from "next/cache";
import { deleteGroup, insertGroup, insertGroupMember } from "../data-access";
import { NewGroup, NewGroupMember } from "../schema";

export async function createGroup(userId: string, values: GroupFormValues) {
  const newGroup: NewGroup = {
    createdBy: parseInt(userId),
    name: values.name,
    description: values.description,
  };

  const group = await insertGroup(newGroup);

  if (!group) {
    return {
      success: false,
      errors: {
        message: "Could not create group at this time. Please try again later.",
      },
    };
  }

  revalidatePath("/groups");

  return {
    success: true,
    errors: undefined,
  };
}

export async function removeGroup(groupId: number, formData: FormData) {
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

export async function addGroupMember({ userId, groupId }: NewGroupMember) {
  try {
    const newGroupMember = await insertGroupMember({ userId, groupId });

    console.log(newGroupMember);

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
