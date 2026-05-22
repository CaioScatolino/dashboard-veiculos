import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAllUsers = async () => {
  try {
    const data = await db.select().from(users);
    return { message: true, data: data };
  } catch (error) {
    return { message: false, data: error };
  }
};

export const getUserByTelegramId = async (telegramId: number) => {
  try {
    const data = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1);
    return { message: true, data: data };
  } catch (error) {
    return { message: false, data: error };
  }
};
