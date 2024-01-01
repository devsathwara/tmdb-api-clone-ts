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
interface MovieData {
  mid: any;
  adult: any;
  backdrop_path: any;
  genre_ids: any;
  original_language: any;
  original_title: any;
  overview: any;
  popularity: any;
  poster_path: any;
  release_date: any;
  title: any;
  video: any;
  vote_average: any;
  vote_count: any;
  external_ids: any; // Adjust the type according to your actual data structure
  status: any;
  revenue: any;
  runtime: any;
  budget: any;
}
export const createMovies = async (data: any[]): Promise<void> => {
  if (data.length == 0) {
    console.warn("No data provided for insertion.");
    return;
  }
  // console.log(data);
  try {
    const result = await db
      .insertInto("movies-info")
      .values(data)
      .ignore()
      .execute();
    // if (result) {
    //   console.log(`${result.length} row(s) inserted.`);
    // }
  } catch (error: any) {
    console.error("SQL Error:", error.message);
    throw error;
  }
};

export const getMoviesbyPage = async (pageNumber: any): Promise<any> => {
  // if (pageNumber == 1) {
  //   const movies = await db
  //     .selectFrom("movies-info")
  //     .selectAll()
  //     .orderBy("id")
  //     .limit(20)
  //     .execute();
  //   return movies;
  // }
  const limit: any = 20;
  let offset: any = pageNumber == 1 ? 0 : (pageNumber - 1) * limit;
  const movies = await db
    .selectFrom("movies-info")
    .selectAll()
    .orderBy("id")
    .limit(limit)
    .offset(offset) //offset ternary operator  used
    .execute();
  return movies;
};
export const insertGenre = async (data: any[]): Promise<any> => {
  if (data.length == 0) {
    console.warn("No data provided for insertion.");
    return;
  }
  // console.log(data);
  try {
    const result = await db
      .insertInto("movies-genre")
      .values(data)
      .ignore()
      .execute();
    // if (result) {
    //   console.log(`${result.length} row(s) inserted.`);
    // }
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

export async function updateFavourites(email: any, movieId: number) {
  const movie: any = await db
    .selectFrom("users")
    .select("favourites")
    .where("email", "=", email)
    .executeTakeFirstOrThrow();
  let favMovies = JSON.parse(movie.favourites, (key, value) =>
    typeof value === "bigint" ? parseInt(value.toString()) : value
  );

  if (!favMovies) {
    favMovies = [];
  }

  const movieIndex = favMovies.findIndex(
    (id: number) => id === Number(movieId)
  );

  if (movieIndex === -1) {
    favMovies.push(Number(movieId));
  } else {
    favMovies = favMovies.filter((id: number) => id !== Number(movieId));
  }

  const result = await db
    .updateTable("users")
    .set({
      favourites: JSON.stringify(favMovies),
    })
    .where("email", "=", email)
    .execute();

  return result;
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
    .execute();
  return list;
}
export async function checkmid(movieID: any) {
  const list = await db
    .selectFrom("movies-info")
    .select("title")
    .where("mid", "=", parseInt(`${movieID}`))
    .execute();
  return list;
}
export async function deleteFavourite(mid: any, email: any) {
  const list = await checkFavourites(email);
  const favs: string | null = list[0].favourites as string | null;

  if (favs === null) {
    throw new Error("No favourites found for this user");
  }
  const ids = JSON.parse(favs);
  const newIds = ids.filter((i: number) => i !== parseInt(String(mid)));
  const result = await db
    .updateTable("users")
    .set({
      favourites: JSON.stringify(newIds),
    })
    .where("email", "=", email)
    .execute();
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
export const moviesReleasedin3Years = async () => {
  const result = sql<any>`
  SELECT YEAR(release_date) AS ReleaseYear, WEEKOFYEAR(release_date) AS Week, COUNT(*) AS NumberOfMovies FROM \`movies-info\` WHERE release_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 YEAR) AND CURDATE() GROUP BY YEAR(release_date), WEEKOFYEAR(release_date);
  `.execute(db);
  return result;
};
export const GenremoviesReleasedin3Years = async (genreId: any) => {
  const result = sql<any>`
  SELECT YEAR(mi.release_date) AS ReleaseYear, WEEKOFYEAR(mi.release_date) AS Week, mg.name AS GenreName, COUNT(*) AS NumberOfMovies FROM \`movies-info\` mi JOIN \`movies-genre\` mg ON FIND_IN_SET(mg.id, mi.genre_ids) WHERE mi.release_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 YEAR) AND CURDATE() AND mg.id = ${genreId} GROUP BY YEAR(mi.release_date), WEEKOFYEAR(mi.release_date);
  `.execute(db);
  return result;
};
export const getProfitLossMoviesbyId = async (mid: any) => {
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
export const getmoviesbyGenre = async (genre: any, genres: any[]) => {
  const result = sql<any>`SELECT m.*, g.name
  FROM \`movies-info\` m
  JOIN (
    SELECT id, name
    FROM \`movies-genre\`
    WHERE id IN (35, 10751, 14)
  ) g ON FIND_IN_SET(g.id, m.genre_ids)
  WHERE g.name = 'Comedy'
  ORDER BY m.id
  LIMIT 20 OFFSET ((pageNumber - 1) * 20);
  `.execute(db);
};
export const getMoviesbyID = async (mid: any) => {
  const list = await db
    .selectFrom("movies-info")
    .selectAll()
    .where("mid", "=", parseInt(`${mid}`))
    .execute();
  return list;
};
export const insertMovieswatchlist = async (
  email: any,
  mid: any,
  name: any
) => {};
export async function updateWatchList(email: any, movieId: number, id: any) {
  const movie: any = await db
    .selectFrom("watch-list")
    .select("mid")
    .where("email", "=", email)
    .where("id", "=", parseInt(`${id}`))
    .executeTakeFirstOrThrow();
  let favMovies = JSON.parse(movie.mid, (key, value) =>
    typeof value === "bigint" ? parseInt(value.toString()) : value
  );
  if (!favMovies) {
    favMovies = [];
  }

  const movieIndex = favMovies.findIndex(
    (id: number) => id === Number(movieId)
  );

  if (movieIndex === -1) {
    favMovies.push(Number(movieId));
  } else {
    favMovies = favMovies.filter((id: number) => id !== Number(movieId));
  }

  const result = await db
    .updateTable("watch-list")
    .set({
      mid: JSON.stringify(favMovies),
    })
    .where("email", "=", email)
    .where("id", "=", parseInt(`${id}`))
    .execute();

  return result;
}
export async function deleteMoviesWatchList(mid: any, email: any, id: any) {
  const list = await checkWatchList(email);
  const favs: string | null = list[0].mid as string | null;

  if (favs === null) {
    throw new Error("No favourites found for this user");
  }
  const ids = JSON.parse(favs);
  const newIds = ids.filter((i: number) => i !== parseInt(String(mid)));
  const result = await db
    .updateTable("watch-list")
    .set({
      mid: JSON.stringify(newIds),
    })
    .where("email", "=", email)
    .where("id", "=", parseInt(`${id}`))
    .execute();
  return result;
}

export async function shareWatchlist(id: any) {
  const result = await db
    .selectFrom("watch-list")
    .selectAll()
    .where("id", "=", parseInt(id))
    .execute();
  return result;
}
