import { db } from "../db/database";
export const register = async (data: any[]): Promise<any> => {
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
      .executeTakeFirst();
    return user;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
export const updateIsVerified = async (
  email: any,
  token: any
): Promise<any> => {
  try {
    const userUpdate = await db
      .updateTable("users")
      .set({
        is_verified: 1,
      })
      .where("email", "=", `${email}`)
      .executeTakeFirst();
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
      .executeTakeFirst();
    return userUpdate;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
