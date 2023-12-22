import axios from "axios";
import { AxiosResponse } from "axios";
import { MovieModel } from "./models/Movies";

interface MovieDetails {
  id: number;
  genres: number[];
  external_ids: any; // Adjust the type according to your actual data structure
  status: string;
  revenue: number;
  runtime: number;
  popularity: number;
  imdb_id: string;
  budget: number;
}

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  details?: MovieDetails;
}

async function getMovieDetails(movieId: number): Promise<MovieDetails | null> {
  try {
    const response: AxiosResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`
    );

    return {
      id: response.data.id,
      genres: response.data.genres,
      external_ids: response.data.external_ids,
      status: response.data.status,
      revenue: response.data.revenue,
      runtime: response.data.runtime,
      popularity: response.data.popularity,
      imdb_id: response.data.imdb_id,
      budget: response.data.budget,
    };
  } catch (error) {
    console.error(
      `Error fetching details for movie ${movieId}:`,
      error.message
    );
    return null;
  }
}

async function getAllMovies(): Promise<void> {
  let currentPage = 1;
  let moviesWithDetails: Movie[] = [];

  while (true) {
    try {
      const response: AxiosResponse = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?page=${currentPage}&api_key=${TMDB_API_KEY}`
      );

      const pageMovies: Movie[] = response.data.results;

      if (pageMovies.length === 0) {
        break;
      }

      const movieDetailsPromises: Promise<MovieDetails | null>[] =
        pageMovies.map((movie) => getMovieDetails(movie.id));
      const movieDetails: MovieDetails[] = await Promise.all(
        movieDetailsPromises
      );

      moviesWithDetails = pageMovies.map((movie, index) => {
        const details = movieDetails[index];

        return {
          ...movie,
          ...(details ? { details } : {}),
        };
      });

      currentPage++;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      break;
    }
  }

  moviesWithDetails.map((movie) => {
    MovieModel.createMovies(
      movie.id,
      movie.adult,
      movie.backdrop_path,
      movie.genre_ids,
      movie.original_language,
      movie.original_title,
      movie.popularity,
      movie.poster_path,
      movie.release_date,
      movie.title,
      movie.video,
      movie.vote_average,
      movie.vote_count,
      movie.details?.external_ids,
      movie.details?.status,
      movie.details?.revenue,
      movie.details?.runtime,
      movie.details?.imdb_id,
      movie.details?.budget
    );
  });
}

getAllMovies();
