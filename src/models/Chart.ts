import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
export const MoviesReleasedIn3Years = async () => {
  const result = sql<any>`
    SELECT YEAR(release_date) AS ReleaseYear, WEEKOFYEAR(release_date) AS Week, COUNT(*) AS NumberOfMovies FROM \`movies-info\` WHERE release_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 YEAR) AND CURDATE() GROUP BY YEAR(release_date), WEEKOFYEAR(release_date);
    `.execute(db);
  return result;
};
export const GenreMoviesReleasedIn3Years = async (genreId: any) => {
  const result = sql<any>`
    SELECT YEAR(mi.release_date) AS ReleaseYear, WEEKOFYEAR(mi.release_date) AS Week, mg.name AS GenreName, COUNT(*) AS NumberOfMovies FROM \`movies-info\` mi JOIN \`movies-genre\` mg ON FIND_IN_SET(mg.id, mi.genre_ids) WHERE mi.release_date BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 YEAR) AND CURDATE() AND mg.id = ${genreId} GROUP BY YEAR(mi.release_date), WEEKOFYEAR(mi.release_date);
    `.execute(db);
  return result;
};
