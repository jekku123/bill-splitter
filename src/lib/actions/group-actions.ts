"use server";

import { revalidatePath } from "next/cache";

import { ZodError } from "zod";
import {
  deleteGroup,
  insertGroup,
  insertGroupMember,
} from "../../drizzle/data-access";
import { NewGroup } from "../../drizzle/schema";
import { GroupFormValues, groupFormSchema } from "../zod/group-form";
import { MemberFormValues, memberFormSchema } from "../zod/member-form";

export interface GroupActionResponse {
  success: boolean;
  errors?: {
    name?: string;
    description?: string;
    message?: string;
  };
}

export async function createGroupAction(
  userId: string,
  values: GroupFormValues,
): Promise<GroupActionResponse> {
  try {
    const validatedValues = groupFormSchema.parse(values);

    const newGroup: NewGroup = {
      creatorId: parseInt(userId),
      title: validatedValues.name,
      description: validatedValues.description,
    };
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
    if (error instanceof ZodError) {
      const zodError = error as ZodError;
      const errorMap = zodError.flatten().fieldErrors;

      return {
        success: false,
        errors: {
          name: errorMap["name"]?.[0] ?? "",
          description: errorMap["description"]?.[0] ?? "",
        },
      };
    }

    return {
      success: false,
      errors: {
        message: "Could not insert group at this time. Please try again later.",
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
  values,
  groupId,
}: {
  values: MemberFormValues;
  groupId: number;
}): Promise<GroupActionResponse> {
  try {
    const validatedValues = memberFormSchema.parse(values);

    await insertGroupMember({
      username: validatedValues.username,
      groupId,
    });

    revalidatePath(`/groups`);

    return {
      success: true,
      errors: undefined,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError = error as ZodError;
      const errorMap = zodError.flatten().fieldErrors;

      return {
        success: false,
        errors: {
          name: errorMap["username"]?.[0] ?? "",
        },
      };
    }
    return {
      success: false,
      errors: {
        message:
          "Could not add user to group at this time. Please try again later.",
      },
    };
  }
}
