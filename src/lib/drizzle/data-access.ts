'use server';

import { eq } from 'drizzle-orm';
import { db } from '.';
import { users } from './schema';

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
