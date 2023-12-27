import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface FavouriteList {
  email: string;
  id: Generated<number>;
  name: Generated<string | null>;
}

export interface MoviesFavourite {
  email: string;
  id: Generated<number>;
  lid: number;
  mid: number;
}

export interface MoviesGenre {
  id: Generated<number | null>;
  name: Generated<string | null>;
}

export interface MoviesInfo {
  adult: Generated<string | null>;
  backdrop_path: Generated<string | null>;
  budget: Generated<number | null>;
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

export interface DB {
  "favourite-list": FavouriteList;
  "movies-favourite": MoviesFavourite;
  "movies-genre": MoviesGenre;
  "movies-info": MoviesInfo;
  users: Users;
}
