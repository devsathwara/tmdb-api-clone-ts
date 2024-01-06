import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
export async function insert(email: any, mid: any, id: any) {
  const result = sql<any>`
  UPDATE \`watch-list\`
SET mid = JSON_ARRAY_APPEND(
    COALESCE(mid, JSON_ARRAY()),
    '$',
    ${mid}
)
WHERE email = ${email} AND id = ${id}
  AND JSON_SEARCH(COALESCE(mid, JSON_ARRAY()), 'one', ${mid}) IS NULL;
    `.execute(db);
  return result;
}
export async function update(email: any, id: any, name: any) {
  const result = sql<any>`
      UPDATE \`watch-list\`
      SET name = ${name},updated_at=CURRENT_TIMESTAMP
      WHERE id = ${id} AND email = ${email}
    `.execute(db);
  return result;
}
export async function deleteMovies(mid: any, email: any, id: any) {
  const result = sql<any>`  UPDATE \`watch-list\`
    SET mid = CASE
      WHEN JSON_SEARCH(mid, 'one', ${mid}) IS NOT NULL
      THEN JSON_SET(COALESCE(mid, '[]'), '$', JSON_REMOVE(mid, JSON_UNQUOTE(JSON_SEARCH(mid, 'one', ${mid}))))
      ELSE COALESCE(mid, '[]')
    END
    WHERE email = ${email} AND id=${id}`.execute(db);
  return result;
}

export async function deleteWatchList(email: any, id: any) {
  const result = db
    .deleteFrom("watch-list")
    .where("id", "=", id)
    .where("email", "=", email)
    .execute();
  return result;
}
export async function shareWatchList(id: any) {
  const result = await db
    .selectFrom("watch-list")
    .selectAll()
    .where("id", "=", parseInt(id))
    .executeTakeFirst();
  if (result) {
    const query = sql<any>`  UPDATE \`watch-list\`
      SET is_shared=1,updated_at=CURRENT_TIMESTAMP
      WHERE id=${id}`.execute(db);
    return result;
  }
}
export const insertList = async (data: any): Promise<any> => {
  if (data.length == 0) {
    console.warn("No data provided for insertion.");
    return;
  }
  const result = await db
    .insertInto("watch-list")
    .values(data)
    .ignore()
    .execute();
};
export const accessList = async (email: any): Promise<any> => {
  const list = await db
    .selectFrom("watch-list")
    .selectAll()
    .where("email", "=", `${email}`)
    .execute();
  return list;
};

export async function checkWatchList(email: any) {
  const list = await db
    .selectFrom("watch-list")
    .select("mid")
    .where("email", "=", `${email}`)
    .execute();
  return list;
}
export async function getMid(email: any, id: any) {
  const list = await db
    .selectFrom("watch-list")
    .select("mid")
    .where("email", "=", `${email}`)
    .where("id", "=", parseInt(`${id}`))
    .executeTakeFirst();
  return list;
}
