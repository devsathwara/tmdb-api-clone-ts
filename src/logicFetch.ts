import axios from "axios";
import { AxiosResponse } from "axios";
import { createMovies } from "./models/Movies";
const TMDB_API_KEY = "e84a72fca7815b41c03fe50eacfa8df6";
let result: any[] = [];
// interface MovieDetails {
//   id: number;
//   genres: number[];
//   external_ids: any[]; // Adjust the type according to your actual data structure
//   status: string;
//   revenue: number;
//   runtime: number;
//   popularity: number;
//   budget: number;
// }

// interface Movie {
//   adult: boolean;
//   backdrop_path: string;
//   genre_ids: number[];
//   id: number;
//   original_language: string;
//   original_title: string;
//   overview: string;
//   popularity: number;
//   poster_path: string;
//   release_date: string;
//   title: string;
//   video: boolean;
//   vote_average: number;
//   vote_count: number;
//   details?: MovieDetails;
// }
interface MovieData {
  mid: any;
  adult: any;
  backdrop_path: any;
  genre_ids: any[];
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
async function getMovieDetails(movieId: number): Promise<any> {
  try {
    const response: AxiosResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`
    );

    return {
      // id: response.data.id,
      genres: response.data.genres,
      external_ids: response.data.external_ids,
      status: response.data.status,
      revenue: response.data.revenue,
      runtime: response.data.runtime,
      popularity: response.data.popularity,
      budget: response.data.budget,
    };
  } catch (error: any) {
    console.error(
      `Error fetching details for movie ${movieId}:`,
      error.message
    );
    return null;
  }
}
export async function getAllMovies(): Promise<void> {
  try {
    let currentPage = 1;

    while (true) {
      try {
        const response: AxiosResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?page=${currentPage}&api_key=${TMDB_API_KEY}`
        );

        const pageMovies: any = response.data.results;
        if (pageMovies.length === 0) {
          break;
        }

        const promiseMovie = pageMovies.map(async (movie: any) => {
          const details = await getMovieDetails(movie.id);
          result.push({
            mid: movie.id,
            adult: movie.adult,
            backdrop_path: movie.backdrop_path,
            genre_ids: JSON.stringify(movie.genre_ids),
            original_language: movie.original_language,
            original_title: movie.original_title,
            overview: movie.overview,
            popularity: movie.popularity,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            title: movie.title,
            video: movie.video,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            external_ids: JSON.stringify(details?.external_ids),
            status: details?.status,
            revenue: details?.revenue,
            runtime: details?.runtime,
            budget: details?.budget,
          });
        });
        await Promise.allSettled(promiseMovie);
        // console.log(result);
        await createMovies(result);
        currentPage++;
      } catch (sqlError: any) {
        console.error("SQL Error:", sqlError.message);
        console.error("SQL Error Code:", sqlError.code);
        console.error("SQL Error Number:", sqlError.errno);
        console.error("SQL State:", sqlError.sqlState);
        console.error("SQL Query:", sqlError.sql);
        break;
      }
    }
    // console.log("Data insertion completed.");
  } catch (error: any) {
    console.error("An unexpected error occurred: ", error.message);
  }
}
