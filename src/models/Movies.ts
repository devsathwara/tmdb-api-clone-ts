import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
// export const createMovie = async (data: any, req: Request, res: Response) => {
//   const result = await db.insertInto("movies-info").values(data).execute();
//   return result;
// };
// interface MovieData {
// mid: number,
//   adult: boolean,
//   backdrop_path: string,
//   genre_ids: any,
//   original_language: string,
//   original_title: string,
//   overview: string,
//   popularity: number,
//   poster_path: string,
//   release_date: string,
//   title: string,
//   video: any,
//   vote_average: number,
//   vote_count: number,
//   external_ids: any, // Adjust the type according to your actual data structure
//   status: string,
//   revenue: number,
//   runtime: number,
//   imdb_id: string,
//   budget: number,
// }

export const createMovies = async (
  mid: any,
  adult: any,
  backdrop_path: any,
  genre_ids: any,
  original_language: any,
  original_title: any,
  overview: any,
  popularity: any,
  poster_path: any,
  release_date: any,
  title: any,
  video: any,
  vote_average: any,
  vote_count: any,
  external_ids: any,
  status: any,
  revenue: any,
  runtime: any,
  budget: any
): Promise<any> => {
  const result = await db
    .insertInto("movies-info")
    .values({
      mid: mid,
      adult: adult,
      backdrop_path: backdrop_path,
      genre_ids: genre_ids,
      original_language: original_language,
      original_title: original_title,
      overview: overview,
      popularity: popularity,
      poster_path: poster_path,
      release_date: release_date,
      title: title,
      video: video,
      vote_average: vote_average,
      vote_count: vote_count,
      external_ids: external_ids,
      status: status,
      revenue: revenue,
      runtime: runtime,
      budget: budget,
    })
    .execute();
  return result;
};
