import { raw } from "mysql2";
import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import {
  RawBuilder,
  sql,
  Compilable,
  QueryResult,
  CompiledQuery,
  createRawBuilder,
} from "kysely";
export const createMovies = async (data: any[]): Promise<void> => {
  if (data.length == 0) {
    console.warn("No data provided for insertion.");
    return;
  }

  try {
    for (const record of data) {
      const result = await sql<any>`
        INSERT INTO \`movies-info\`(
          mid,
          adult,
          backdrop_path,
          genre_ids,
          original_language,
          original_title,
          overview,
          popularity,
          poster_path,
          release_date,
          title,
          video,
          vote_average,
          vote_count,
          external_ids,
          status,
          revenue,
          runtime,
          budget,
          countries,
          created_at,
          updated_at,
          keywords
      ) 
        VALUES (
          ${record.mid},
          ${record.adult},
          ${record.backdrop_path},
          ${record.genre_ids},
          ${record.original_language},
          ${record.original_title},
          ${record.overview},
          ${record.popularity},
          ${record.poster_path},
          ${record.release_date},
          ${record.title},
          ${record.video},
          ${record.vote_average},
          ${record.vote_count},
          ${record.external_ids},
          ${record.status},
          ${record.revenue},
          ${record.runtime},
          ${record.budget},
          ${record.countries},
          ${record.created_at},
          ${record.updated_at},
          ${record.keywords}
        )
        ON DUPLICATE KEY UPDATE
          mid = VALUES(mid),
          adult = VALUES(adult),
          backdrop_path = VALUES(backdrop_path),
          genre_ids = VALUES(genre_ids),
          original_language = VALUES(original_language),
          original_title = VALUES(original_title),
          overview = VALUES(overview),
          popularity = VALUES(popularity),
          poster_path = VALUES(poster_path),
          release_date = VALUES(release_date),
          title = VALUES(title),
          video = VALUES(video),
          vote_average = VALUES(vote_average),
          vote_count = VALUES(vote_count),
          external_ids = VALUES(external_ids),
          status = VALUES(status),
          revenue = VALUES(revenue),
          runtime = VALUES(runtime),
          budget = VALUES(budget),
          countries = VALUES(countries),
          created_at=VALUES(created_at),
          updated_at = VALUES(updated_at),
          keywords=VALUES(keywords);
      `.execute(db);
    }
    // if (result) {
    //   console.log(`${result.length} row(s) inserted.`);
    // }
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};

export const getMovies = async (
  pageNumber: any,
  limit: any,
  genres: any,
  countries: any,
  language: any,
  name: any,
  adult: any,
  sort_popularity: any,
  sort_title: any,
  sort_voteAverage: any,
  fromDate: any,
  toDate: any,
  runtimeFrom: any,
  runtimeTo: any,
  voteAverageFrom: any,
  voteAverageTo: any,
  voteCountFrom: any,
  voteCountTo: any,
  keywordId: any
): Promise<any> => {
  console.log(typeof keywordId);
  let offset: any = pageNumber == 1 ? 0 : (pageNumber - 1) * limit;
  const movies = sql<any>`
  SELECT *
  FROM \`movies-info\`
  WHERE 
  (${
    genres ? sql`JSON_CONTAINS(\`genre_ids\`, JSON_ARRAY(${genres}))` : sql`1`
  })
  AND (${
    countries
      ? sql`JSON_CONTAINS(\`countries\`, JSON_ARRAY(${countries}))`
      : sql`1`
  })
  AND (${language ? sql`\`original_language\` = ${language}` : sql`1`})
  AND (${name ? sql`\`title\` = ${name}` : sql`1`})
  AND (${adult ? sql`\`adult\` = ${adult}` : sql`1`})
  AND (${fromDate ? sql`\`release_date\` >= ${fromDate}` : sql`1`})
  AND (${runtimeFrom ? sql`\`runtime\` >= ${runtimeFrom}` : sql`1`})
  AND (${runtimeTo ? sql`\`runtime\` <= ${runtimeTo}` : sql`1`})
  AND (${
    voteAverageFrom ? sql`\`vote_average\` >= ${voteAverageFrom}` : sql`1`
  })
  AND (${voteAverageTo ? sql`\`vote_average\` <= ${voteAverageTo}` : sql`1`})
  AND (${voteCountFrom ? sql`\`vote_count\` >= ${voteCountFrom}` : sql`1`})
  AND (${voteCountTo ? sql`\`vote_count\` <= ${voteCountTo}` : sql`1`})
  AND (${toDate ? sql`\`release_date\` <= ${toDate}` : sql`1`})
  AND (${
    keywordId
      ? sql`${keywordId
          .map(
            (id: any) =>
              sql`JSON_SEARCH(\`keywords\`, 'one', ${id}, NULL, '$[*].id') IS NOT NULL`
          )
          .reduce((prev: any, curr: any) => sql`${prev} OR ${curr}`)}`
      : sql`1`
  })
  
  ORDER BY
  ${
    sort_popularity === "popu.desc"
      ? sql`\`popularity\` DESC`
      : sort_popularity === "popu.asc"
      ? sql`\`popularity\` ASC`
      : sort_title === "title.asc"
      ? sql`\`title\` ASC`
      : sort_title === "title.desc"
      ? sql`\`title\` DESC`
      : sort_voteAverage === "vote_average.asc"
      ? sql`\`vote_average\` ASC`
      : sort_voteAverage === "vote_average.desc"
      ? sql`\`vote_average\` DESC`
      : sql`id`
  }
  LIMIT ${limit != null ? limit : 20}
  OFFSET ${offset};`.execute(db);
  return movies;
};
export const insertGenre = async (data: any[]): Promise<any> => {
  if (data.length == 0) {
    console.warn("No data provided for insertion.");
    return;
  }

  try {
    const result = await db
      .insertInto("movies-genre")
      .values(data)
      .ignore()
      .execute();

    return result;
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};
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
export const accessListUserWise = async (email: any): Promise<any> => {
  const list = await db
    .selectFrom("watch-list")
    .selectAll()
    .where("email", "=", `${email}`)
    .execute();
  return list;
};
export async function insertFavourites(email: any, mid: number) {
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
export async function checkFavourites(email: any) {
  const list = await db
    .selectFrom("users")
    .select("favourites")
    .where("email", "=", `${email}`)
    .execute();
  return list;
}
export async function checkWatchList(email: any) {
  const list = await db
    .selectFrom("watch-list")
    .select("mid")
    .where("email", "=", `${email}`)
    .execute();
  return list;
}
export async function MoviesIdWatchList(email: any, id: any) {
  const list = await db
    .selectFrom("watch-list")
    .select("mid")
    .where("email", "=", `${email}`)
    .where("id", "=", parseInt(`${id}`))
    .executeTakeFirst();
  return list;
}
export async function checkMid(movieID: any) {
  const list = await db
    .selectFrom("movies-info")
    .selectAll()
    .where("mid", "=", parseInt(`${movieID}`))
    .execute();
  return list;
}
export async function deleteFavourite(mid: any, email: any) {
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
export const countryRevenue = async (countries: any) => {
  const result = sql<any>`
    SELECT
      JSON_UNQUOTE(JSON_EXTRACT(countries, "$[0]")) as country_name,
      SUM(revenue) as total_revenue
    FROM  \`movies-info\`
    WHERE JSON_UNQUOTE(JSON_EXTRACT(countries, "$[0]")) IN (${countries})
    GROUP BY JSON_UNQUOTE(JSON_EXTRACT(countries, "$[0]"))
  `.execute(db);
  return result;
};
export const MoviesReleasedIn3Years = async () => {
  const result = sql<any>`
  SELECT YEAR(release_date) AS ReleaseYear, WEEKOFYEAR(release_date) AS Week, COUNT(*) AS NumberOfMovies FROM \`movies-info\` WHERE release_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 YEAR) AND CURDATE() GROUP BY YEAR(release_date), WEEKOFYEAR(release_date);
  `.execute(db);
  return result;
};
export const GenreMoviesReleasedIn3Years = async (genreId: any) => {
  const result = sql<any>`
  SELECT YEAR(mi.release_date) AS ReleaseYear, WEEKOFYEAR(mi.release_date) AS Week, mg.name AS GenreName, COUNT(*) AS NumberOfMovies FROM \`movies-info\` mi JOIN \`movies-genre\` mg ON FIND_IN_SET(mg.id, mi.genre_ids) WHERE mi.release_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 YEAR) AND CURDATE() AND mg.id = ${genreId} GROUP BY YEAR(mi.release_date), WEEKOFYEAR(mi.release_date);
  `.execute(db);
  return result;
};
export const getMoviesGrossIncome = async (mid: any) => {
  const result = sql<any>`  SELECT
  title,
  budget,
  revenue,
  CASE
    WHEN revenue >= budget THEN 'Profit'
    ELSE 'Loss'
  END AS profit_loss,
  ABS(revenue - budget) AS profit_loss_amount
FROM \`movies-info\`
WHERE mid = ${mid}`.execute(db);
  return result;
};
export const getMoviesbyID = async (mid: any) => {
  const list = await db
    .selectFrom("movies-info")
    .selectAll()
    .where("mid", "=", parseInt(`${mid}`))
    .executeTakeFirst();
  return list;
};
export async function insertMoviesWatchlist(email: any, mid: any, id: any) {
  console.log(`UPDATE \`watch-list\`
  SET mid = JSON_ARRAY_APPEND(
    COALESCE(mid, JSON_ARRAY()),
    '$',
    ${mid}
  )
  WHERE email = '${email}' AND id=${id}
  AND JSON_SEARCH(COALESCE(mid, JSON_ARRAY()), 'one', ${mid}) IS NULL`);
  const result = sql<any>`
  UPDATE \`watch-list\`
  SET mid = JSON_ARRAY_APPEND(
    COALESCE(mid, JSON_ARRAY()),
    '$',
    ${mid}
  )
  WHERE email = ${email} AND id=${id}
  AND JSON_SEARCH(COALESCE(mid, JSON_ARRAY()), 'one', ${mid}) IS NULL
  `.execute(db);
  return result;
}
export async function updateWatchlistName(email: any, id: any, name: any) {
  const result = sql<any>`
    UPDATE \`watch-list\`
    SET name = ${name},updated_at=CURRENT_TIMESTAMP
    WHERE id = ${id} AND email = ${email}
  `.execute(db);
  return result;
}
export async function deleteMoviesWatchList(mid: any, email: any, id: any) {
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
export async function LikeDislikeMovies(data: any) {
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
export async function RatingsMovies(data: any) {
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
export async function CommentMovies(data: any) {
  const result = await db.insertInto("movie_comments").values(data).execute();
  return result;
}
