import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
export const insert = async (data: any[]): Promise<void> => {
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
  // let offset: any = pageNumber == 1 ? 0 : (pageNumber - 1) * limit;
  // name = name + "%";
  const movies = sql<any>`
  SELECT *
  FROM \`movies-info\`
  WHERE 
  (${
    genres.length > 0
      ? sql`JSON_CONTAINS(\`genre_ids\`, JSON_ARRAY(${genres}))`
      : sql`1`
  })
  AND (${
    countries.length > 0
      ? sql`JSON_CONTAINS(\`countries\`, JSON_ARRAY(${countries}))`
      : sql`1`
  })
  AND (${language ? sql`\`original_language\` = ${language}` : sql`1`})
  AND (${
    name && typeof name === "string" && name.length > 0
      ? sql`\`title\` LIKE ${name + "%"}`
      : sql`1`
  })
  AND (${adult ? sql`\`adult\` = ${adult}` : sql`1`})
  AND (${fromDate ? sql`\`release_date\` >= ${fromDate}` : sql`1`})
  AND (${runtimeFrom ? sql`\`runtime\` >= ${parseInt(runtimeFrom)}` : sql`1`})
  AND (${runtimeTo ? sql`\`runtime\` <= ${parseInt(runtimeTo)}` : sql`1`})
  AND (${
    voteAverageFrom
      ? sql`\`vote_average\` >= ${parseFloat(voteAverageFrom)}`
      : sql`1`
  })
  AND (${
    voteAverageTo
      ? sql`\`vote_average\` <= ${parseFloat(voteAverageTo)}`
      : sql`1`
  })
  AND (${
    voteCountFrom ? sql`\`vote_count\` >= ${parseInt(voteCountFrom)}` : sql`1`
  })
  AND (${
    voteCountTo ? sql`\`vote_count\` <= ${parseInt(voteCountTo)}` : sql`1`
  })
  AND (${toDate ? sql`\`release_date\` <= ${toDate}` : sql`1`})
  AND (${
    keywordId.length > 0
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
      : sql`\`id\` ASC` // Default ORDER BY
  }
  LIMIT ${limit != null ? parseInt(limit) : 20}
  OFFSET ${
    pageNumber == 1
      ? 0
      : (pageNumber - 1) * (limit != null ? parseInt(limit) : 20)
  };`.execute(db);
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
export async function checkMid(movieID: any) {
  const list = await db
    .selectFrom("movies-info")
    .selectAll()
    .where("mid", "=", parseInt(`${movieID}`))
    .execute();
  return list;
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

export const getIncome = async (mid: any) => {
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
export const getMovie = async (mid: any) => {
  const list = await db
    .selectFrom("movies-info")
    .selectAll()
    .where("mid", "=", parseInt(`${mid}`))
    .executeTakeFirst();
  return list;
};
