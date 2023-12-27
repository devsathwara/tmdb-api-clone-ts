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
export const updateToken = async (email: any, token: any): Promise<any> => {
  try {
    const userUpdate = await db
      .updateTable("users")
      .set({
        verify_token: token,
      })
      .where("email", "=", `${email}`)
      .execute();
    return userUpdate;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
export const updateVerifyToken = async (
  email: any,
  token: any
): Promise<any> => {
  try {
    const userUpdate = await db
      .updateTable("users")
      .set({
        verify_token: null,
        is_verified: 1,
      })
      .where("email", "=", `${email}`)
      .execute();
    return userUpdate;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
export const findUserByResetToken = async (token: any): Promise<any> => {
  try {
    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("reset_token", "=", `${token}`)
      .execute();
    return user;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
export const updateResetToken = async (
  email: any,
  token: any
): Promise<any> => {
  try {
    const userUpdate = await db
      .updateTable("users")
      .set({
        reset_token: token,
      })
      .where("email", "=", `${email}`)
      .execute();
    return userUpdate;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
export const updatePassword = async (
  email: any,
  password: any
): Promise<any> => {
  try {
    const userUpdate = await db
      .updateTable("users")
      .set({
        password: password,
      })
      .where("email", "=", `${email}`)
      .execute();
    return userUpdate;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
