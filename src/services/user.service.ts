import { db } from "../db/connection";
import { users } from "../db/schema";

export const getAllUsers = async () => {
  try {
    const data = await db.select().from(users);
    return { message: true, data: data };
  } catch (error) {
    return { message: false, data: error };
  }
};
