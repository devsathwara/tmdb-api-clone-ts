import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface CountryRevenue {
  id: Generated<number>;
  name: Generated<string | null>;
  revenue: Generated<number | null>;
}

export interface Genremovieslist {
  id: Generated<number>;
  mid: number;
  rid: number;
}

export interface MovieComments {
  comment: Generated<string | null>;
  created_at: Generated<Date>;
  id: Generated<number>;
  movie_id: Generated<number | null>;
  parent_id: Generated<number | null>;
  user_email: Generated<string | null>;
}

export interface MovieLikes {
  created_at: Generated<Date>;
  id: Generated<number>;
  mid: number;
  reaction: Generated<string | null>;
  user_email: Generated<string | null>;
}

export interface MoviesFavourite {
  email: string;
  id: Generated<number>;
  lid: number;
  mid: number;
}

export interface MoviesGenre {
  id: number;
  name: Generated<string | null>;
  ratings: Generated<number | null>;
}

export interface MoviesInfo {
  adult: Generated<string | null>;
  backdrop_path: Generated<string | null>;
  budget: Generated<number | null>;
  countries: Generated<string | null>;
  external_ids: Generated<string | null>;
  genre_ids: Generated<string | null>;
  id: Generated<number>;
  mid: number;
  original_language: Generated<string | null>;
  original_title: Generated<string | null>;
  overview: Generated<string | null>;
  popularity: Generated<number | null>;
  poster_path: Generated<string | null>;
  release_date: Generated<Date | null>;
  revenue: Generated<number | null>;
  runtime: Generated<number | null>;
  status: Generated<string | null>;
  title: Generated<string | null>;
  video: Generated<number | null>;
  vote_average: Generated<number | null>;
  vote_count: Generated<number | null>;
}

export interface MoviesRatings {
  created_at: Generated<Date | null>;
  id: Generated<number>;
  movie_id: number;
  rating: Generated<number | null>;
  types: Generated<string | null>;
  user_email: string;
}

export interface Users {
  created_at: Generated<Date>;
  email: string;
  favourites: Generated<string | null>;
  id: Generated<number>;
  is_verified: Generated<number | null>;
  password: string;
  reset_token: Generated<string | null>;
  updated_at: Generated<Date>;
  username: string;
  verify_token: Generated<string | null>;
}

export interface WatchList {
  email: string;
  id: Generated<number>;
  mid: Generated<string | null>;
  name: string;
}

export interface DB {
  "country-revenue": CountryRevenue;
  genremovieslist: Genremovieslist;
  movie_comments: MovieComments;
  movie_likes: MovieLikes;
  movies_ratings: MoviesRatings;
  "movies-favourite": MoviesFavourite;
  "movies-genre": MoviesGenre;
  "movies-info": MoviesInfo;
  users: Users;
  "watch-list": WatchList;
}
