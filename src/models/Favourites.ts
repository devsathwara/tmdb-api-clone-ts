import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
export async function insert(email: any, mid: number) {
  const query = sql<any>`
    UPDATE users
    SET favourites = JSON_ARRAY_APPEND(
      COALESCE(favourites, JSON_ARRAY()),
      '$',
      ${mid}
    )
    WHERE email = ${email}
    AND JSON_SEARCH(COALESCE(favourites, JSON_ARRAY()), 'one', ${mid}) IS NULL
  `.execute(db);

  return query;
}
export async function check(email: any) {
  const list = await db
    .selectFrom("users")
    .select("favourites")
    .where("email", "=", `${email}`)
    .execute();
  return list;
}
export async function deleteFav(mid: any, email: any) {
  const result = sql<any>`
    UPDATE users
    SET favourites = CASE
      WHEN JSON_SEARCH(favourites, 'one', ${mid}) IS NOT NULL
      THEN JSON_SET(COALESCE(favourites, '[]'), '$', JSON_REMOVE(favourites, JSON_UNQUOTE(JSON_SEARCH(favourites, 'one', ${mid}))))
      ELSE COALESCE(favourites, '[]')
    END
    WHERE email = ${email}
      `.execute(db);
  return result;
}
