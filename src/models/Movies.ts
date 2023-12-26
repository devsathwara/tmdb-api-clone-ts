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

// export const createMovies = async (
//  data :any[]
// ): Promise<any> => {
//   // console.log("Inserting data:", {
// mid,
// adult,
// backdrop_path,
// genre_ids,
// original_language,
// original_title,
// overview,
// popularity,
// poster_path,
// release_date,
// title,
// video,
// vote_average,
// vote_count,
// external_ids,
// status,
// revenue,
// runtime,
// budget,
//   // });
// const rows=data.map(({  mid,
//   adult,
//   backdrop_path,
//   genre_ids,
//   original_language,
//   original_title,
//   overview,
//   popularity,
//   poster_path,
//   release_date,
//   title,
//   video,
//   vote_average,
//   vote_count,
//   external_ids,
//   status,
//   revenue,
//   runtime,
//   budget, }) => {
//     `('${mid}', ${adult}, ${backdrop_path},${genre_ids},${original_language},${original_title},${overview},${popularity},${poster_path},${release_date},${title},${video},${vote_average},${vote_count},${external_ids},${status},${revenue},${runtime},${budget})`
//   }).join(',')
//   const result = await db
//     .insertInto("movies-info")
//     .values(rows)
//     .execute();
//   return result;
// };
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
