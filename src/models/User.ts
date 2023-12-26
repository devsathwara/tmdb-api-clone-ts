import { string } from "zod";
import { db } from "../db/database";
import { Users } from "../db/db";

interface User {
  username: any;
  email: any;
  password?: any;
  is_verified: any;
  reset_token: any;
  reset_token_expires_at: any;
  favourites: any;
  created_at: any;
  updated_at: any;
}
export const registeruser = async (data: any[]): Promise<any> => {
  try {
    const user = await db.insertInto("users").values(data).execute();
    return user;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
export const findUser = async (email: string): Promise<any> => {
  try {
    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", `${email}`)
      .execute();
    return user;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
