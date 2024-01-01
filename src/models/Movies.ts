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
  if (pageNumber == 1) {
    const movies = await db
      .selectFrom("movies-info")
      .selectAll()
      .orderBy("id")
      .limit(20)
      .execute();
    return movies;
  }
  const limit: any = 20;
  let offset: any = (pageNumber - 1) * limit;
  const movies = await db
    .selectFrom("movies-info")
    .selectAll()
    .orderBy("id")
    .limit(limit)
    .offset(offset)
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
