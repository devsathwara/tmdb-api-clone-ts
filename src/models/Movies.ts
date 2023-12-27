import { date } from "zod";
import { db } from "../db/database";
import { MoviesInfo } from "../db/db";

// export const createMovie = async (data: any, req: Request, res: Response) => {
//   const result = await db.insertInto("movies-info").values(data).execute();
//   return result;
// };
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
