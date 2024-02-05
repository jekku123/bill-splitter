import { eq } from "drizzle-orm";
import { db } from ".";
import { NewUser, User, users } from "./schema";

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

export async function createUser(user: NewUser) {
  try {
    const newUser = await db.insert(users).values(user);
    return newUser;
  } catch (error) {
    console.error(
      "Error occurred while trying to create a new user in data-access.ts",
      error,
    );
    throw error;
  }
}

export async function insertUser(user: NewUser): Promise<User[]> {
  return db.insert(users).values(user).returning();
}
