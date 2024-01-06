import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
export async function insert(data: any) {
  if (!data) {
    console.warn("No data provided for insertion.");
    return;
  }
  try {
    const checkLikeDislike = await db
      .selectFrom("movie_likes")
      .selectAll()
      .where("mid", "=", data.mid)
      .executeTakeFirst();
    if (checkLikeDislike) {
      const result = await db
        .updateTable("movie_likes")
        .set({
          reaction: data.reaction,
          updated_at: new Date(),
        })
        .where("mid", "=", data.mid)
        .executeTakeFirst();
      return result;
    } else {
      const result = await db.insertInto("movie_likes").values(data).execute();
      return result;
    }
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
}
export async function getReaction(mid: any) {
  const result = sql<any>`SELECT
  COUNT(CASE WHEN reaction = 'LIKE' THEN 1 END) AS like_count,
  COUNT(CASE WHEN reaction = 'DISLIKE' THEN 1 END) AS dislike_count
FROM movie_likes WHERE mid=${mid};
`.execute(db);
  return result;
}
