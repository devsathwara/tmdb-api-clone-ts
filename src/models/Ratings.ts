import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
export async function genreRatings(id: any) {
  const result = sql<any>`SELECT
    JSON_UNQUOTE(JSON_EXTRACT(mi.genre_ids, "$[0]")) as genre_id,
    mg.name as genre_name,
    SUM(mi.popularity) as popularity
  FROM \`movies-info\` mi
  JOIN \`movies-genre\` mg ON JSON_UNQUOTE(JSON_EXTRACT(mi.genre_ids, "$[0]")) = mg.id
  WHERE JSON_UNQUOTE(JSON_EXTRACT(mi.genre_ids, "$[0]")) IN (${id})
  GROUP BY genre_id, genre_name;`.execute(db);
  return result;
}

export async function insert(data: any) {
  if (!data) {
    console.warn("No data provided for insertion.");
    return;
  }
  try {
    const checkRatings = await db
      .selectFrom("movies_ratings")
      .selectAll()
      .where("mid", "=", data.mid)
      .where("email", "=", data.email)
      .executeTakeFirst();
    if (checkRatings) {
      const result = await db
        .updateTable("movies_ratings")
        .set({
          rating: data.rating,
          updated_at: new Date(),
        })
        .where("mid", "=", data.mid)
        .where("types", "=", data.types)
        .execute();
      return result;
    } else {
      const result = await db
        .insertInto("movies_ratings")
        .values(data)
        .execute();
      return result;
    }
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
}
