import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface MovieComments {
  comment: string;
  created_at: Generated<Date>;
  id: Generated<number>;
  movie_id: Generated<number | null>;
  parent_id: Generated<number | null>;
  updated_at: Generated<Date>;
  user_email: Generated<string | null>;
}

export interface MovieLikes {
  created_at: Generated<Date>;
  id: Generated<number>;
  mid: number;
  reaction: Generated<string | null>;
  updated_at: Generated<Date>;
  user_email: Generated<string | null>;
}

export interface MoviesGenre {
  id: number;
  name: Generated<string | null>;
}

export interface MoviesInfo {
  adult: Generated<number | null>;
  backdrop_path: Generated<string | null>;
  budget: Generated<number | null>;
  countries: Generated<string | null>;
  created_at: Generated<Date>;
  external_ids: Generated<string | null>;
  genre_ids: Generated<string | null>;
  id: Generated<number>;
  keywords: string;
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
  updated_at: Generated<Date>;
  video: Generated<number | null>;
  vote_average: Generated<number | null>;
  vote_count: Generated<number | null>;
}

export interface MoviesRatings {
  created_at: Generated<Date | null>;
  email: string;
  id: Generated<number>;
  mid: number;
  rating: Generated<number | null>;
  types: Generated<string | null>;
  updated_at: Generated<Date>;
}

export interface Users {
  created_at: Generated<Date>;
  email: string;
  favourites: Generated<string | null>;
  id: Generated<number>;
  is_verified: Generated<number | null>;
  password: string;
  updated_at: Generated<Date>;
  username: string;
}

export interface WatchList {
  created_at: Generated<Date>;
  email: string;
  id: Generated<number>;
  is_shared: Generated<number | null>;
  mid: Generated<string | null>;
  name: string;
  updated_at: Generated<Date>;
}

export interface DB {
  movie_comments: MovieComments;
  movie_likes: MovieLikes;
  movies_ratings: MoviesRatings;
  "movies-genre": MoviesGenre;
  "movies-info": MoviesInfo;
  users: Users;
  "watch-list": WatchList;
}
