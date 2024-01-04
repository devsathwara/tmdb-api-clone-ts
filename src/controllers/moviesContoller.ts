import express, { NextFunction, Request, Response, request } from "express";
import * as Movies from "../models/Movies";
export const displayMovies = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentDate: Date = new Date();
    const formattedCurrentDate: string = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(currentDate);
    const pageNumber: number = parseInt(req.params.pagenumber);
    const {
      genre,
      countries,
      languages,
      name,
      adult,
      sort_title,
      sort_popularity,
      sort_vote_Average,
      fromDate,
      toDate,
      runtimeFrom,
      runtimeTo,
      voteAverageFrom,
      voteAverageTo,
      voteCountFrom,
      voteCountTo,
      keywordsID,
    } = req.body || {};
    const { limit } = req.body;
    if (!pageNumber || isNaN(pageNumber)) {
      return res.status(400).send({ error: "Invalid page number!" });
    }
    const moviesData = await Movies.getMovies(
      pageNumber,
      limit,
      genre || null,
      countries || null,
      languages || null,
      name || null,
      adult || null,
      sort_popularity || null,
      sort_title || null,
      sort_vote_Average || null,
      fromDate || null,
      toDate || null,
      runtimeFrom || null,
      runtimeTo || null,
      voteAverageFrom || null,
      voteAverageTo || null,
      voteCountFrom || null,
      voteCountTo || null,
      keywordsID || null
    );
    if (moviesData) {
      return res.json({ page: pageNumber, Movies: moviesData });
    }
  } catch (error) {
    console.error(error);
  }
};
export const createWatchList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { name } = req.body;
    if (!name) {
      return res.json({ message: "List name required" });
    }
    const email = req.cookies.email;
    const nameList = await Movies.accessListUserWise(email);
    for (let i of nameList) {
      if (i.name === name) {
        return res.json({ message: `This list already exists!` });
      }
    }

    let data: any = {
      name: name,
      email: email,
    };
    const result = await Movies.insertList(data);
    // if (!result) {
    //   return res.status(400).send({ message: "errror while creating list" });
    // }
    return res.json({ Message: "Successfully created list." });
  } catch (error: any) {
    console.error(error);
  }
};
export const accessListUser = async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const userList = await Movies.accessListUserWise(userEmail);
    if (userList) {
      return res.json({ favouriteList: userList });
    } else {
      return res.json({ message: "No List Found" });
    }
  } catch (error) {
    console.error(error);
  }
};
//   try {
//     const userEmail = req.cookies.email;
//     const { mid } = req.body;
//     const midCheck = await Movies.checkmid(parseInt(mid));
//     // (3).toFixed;

//     if (midCheck) {
//       return res.status(400).send("Movie id is not there in database");
//     }
//     const userFavouritecheck = await Movies.checkFavourites(userEmail);
//     userFavouritecheck.forEach((id: { favourites: string | null }) => {
//       // if (parseInt(id.toString()) === parseInt(mid)) {
//       //   return res.json({ message: "This movie is already Favourites" });
//       // }
//       // console.log(id);
//       let favouritesArray =
//         id.favourites === null ? [] : JSON.parse(id.favourites);
//       if (favouritesArray.includes(parseInt(mid))) {
//         return res.json({ message: "Already in the Favorites" });
//       }
//     });
//     const userFavoriteList = await Movies.updateFavourites(userEmail, mid);
//     return res.json({ message: `${mid} added to your Favourites` });
//   } catch (error) {
//     console.error(error);
//   }
// };
export const updateOrInsertFavourites = async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const { mid } = req.body;
    const midCheck = await Movies.checkMid(mid);
    if (!midCheck) {
      return res.status(400).send("Movie id is not there in database");
    }
    const result = await Movies.insertFavourites(userEmail, mid);
    if (result.numAffectedRows) {
      return res.json({ message: `${mid} added to your Favorites` });
    } else {
      return res.json({ message: `${mid} already in your Favorites` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteFavourite = async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const { mid } = req.body;
    const result: any = await Movies.deleteFavourite(mid, userEmail);
    return res.json({ message: `${mid} deleted from favourites` });
  } catch (error) {
    console.error(error);
  }
};
export const countriesRevenue = async (req: Request, res: Response) => {
  try {
    const { countries } = req.body;
    const countryList: any = JSON.stringify(countries);
    let countriesRevenue: any[] = [];

    await Promise.all(
      countries.map(async (country: any) => {
        const result = await Movies.countryRevenue(country);
        result.rows.forEach((row: any) => {
          countriesRevenue.push({ [row.country_name]: row.total_revenue });
        });
      })
    );

    // console.log(countriesRevenue);
    res.json(countriesRevenue);
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const moviesReleasedin3Years = async (req: Request, res: Response) => {
  try {
    const { id }: any = req.params;
    if (id) {
      const data = await Movies.GenreMoviesReleasedIn3Years(id);
      return res.json(data.rows);
    }
    const releasedMovies = await Movies.MoviesReleasedIn3Years();
    return res.status(200).json(releasedMovies);
  } catch (error) {
    console.error(error);
  }
};
export const getMoviesIncome = async (req: Request, res: Response) => {
  try {
    const { mid } = req.body;
    const midCheck = await Movies.checkMid(parseInt(mid));
    // (3).toFixed;

    if (!midCheck) {
      return res.status(400).send("Movie id is not there in database");
    }
    if (mid) {
      const income = await Movies.getMoviesGrossIncome(mid);
      return res.status(200).json(income);
    } else {
      return res.status(404).json({ message: "Movie id required" });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getMoviesFavourties = async (req: Request, res: Response) => {
  const { email } = req.cookies;
  const favouritesId = await Movies.checkFavourites(email);
  const moviesArr: any[] = [];
  await Promise.all(
    favouritesId.map(async (i: any) => {
      let arr = JSON.parse(i.favourites);
      const moviePromises = arr.map(async (i: any) => {
        const movie = await Movies.getMoviesbyID(i);
        return movie;
      });
      moviesArr.push(...(await Promise.all(moviePromises)));
    })
  );
  console.log(moviesArr);
  return res.status(201).json({ FavouritesMovies: moviesArr });
};
export const insertMovieswatchlist = async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const { mid, id } = req.body;
    const midCheck = await Movies.checkMid(mid);
    if (!midCheck) {
      return res.status(400).send("Movie id is not there in database");
    }
    const result = await Movies.insertMoviesWatchlist(userEmail, mid, id);
    if (result.numAffectedRows) {
      return res.json({ message: `${mid} added to your WatchList` });
    } else {
      return res.json({ message: `${mid} already in your WatchList` });
    }
  } catch (error) {
    console.error(error);
  }
};
export const getMoviesWatchList = async (req: Request, res: Response) => {
  const { email } = req.cookies;
  const { id } = req.params;
  const favouritesId: any = await Movies.MoviesIdWatchList(email, id);
  if (favouritesId.mid === null) {
    return res
      .status(404)
      .json({ message: "List Doesnt have any Movies Please Add Movies" });
  }
  console.log(favouritesId);
  const moviesArr: any[] = [];

  let arr = JSON.parse(favouritesId.mid);
  const moviePromises = arr.map(async (i: any) => {
    const movie = await Movies.getMoviesbyID(i);
    return movie;
  });
  moviesArr.push(...(await Promise.all(moviePromises)));

  if (moviesArr.length == 0) {
    return res.send({ message: "No Movies are there is Watch List" });
  }
  return res.status(201).json({ WatchListMovies: moviesArr });
};
export const deleteMoviesWatchList = async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const { id } = req.params;
    const { mid } = req.body;
    const deleteFav = await Movies.deleteMoviesWatchList(mid, userEmail, id);
    console.log(deleteFav);
    return res.json({ message: "Deleted from Your Watch list" });
  } catch (error) {
    console.error(error);
  }
};
export const accessWatchListpublic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: any = await Movies.shareWatchList(id);
    let movieArr: any[] = [];
    let arr = JSON.parse(data.mid);
    if (arr === null) {
      return res.send({ message: "No Movies are there is Watch List" });
    }
    const moviePromises = arr.map(async (i: any) => {
      const movie = await Movies.getMoviesbyID(i);
      return movie;
    });
    movieArr.push(...(await Promise.all(moviePromises)));

    return res.status(201).json({
      Watchlistname: data.name,
      Owner: data.email,
      WatchListMovies: movieArr,
    });
  } catch (error) {
    console.error(error);
  }
};
export async function updateWatchlistName(req: Request, res: Response) {
  const email = req.cookies.email;
  const { id } = req.params;
  const { name } = req.body;
  const result = await Movies.updateWatchlistName(email, id, name);
  if (!result) {
    return res.status(400).json({ message: "Failed to Update the Name" });
  } else {
    return res.status(200).json({ message: "Updated Successfully!" });
  }
}
export async function deleteWatchlist(req: Request, res: Response) {
  try {
    const email = req.cookies.email;
    const { id } = req.params;

    const result = await Movies.deleteWatchList(email, id);
    if (!result) {
      return res.status(400).json({ message: "Failed to Update the Name" });
    } else {
      return res.status(200).json({ message: "Delete Successfully!" });
    }
  } catch (error) {
    console.error(error);
  }
}
export async function GenreRatings(req: Request, res: Response) {
  const { id } = req.body;
  try {
    const result = await Movies.genreRatings(id);
    if (!result) {
      return res.status(400).json({ message: "Genres is invalid" });
    } else {
      return res.status(200).json({ GenreRating: result.rows });
    }
  } catch (error) {
    console.error(error);
  }
}
export async function LikeDislikeMovies(req: Request, res: Response) {
  try {
    let { type } = req.body;
    const email = req.cookies.email;
    let { mid } = req.params;
    let data: any = {
      mid: parseInt(mid),
      user_email: email,
      reaction: type,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await Movies.LikeDislikeMovies(data);
    if (result) {
      res.status(200).json({ message: `${mid} ${type} by ${email}` });
    }
  } catch (error) {
    console.error(error);
  }
}
export async function RatingsMovies(req: Request, res: Response) {
  try {
    let { Ratings } = req.body;
    const email = req.cookies.email;
    let { mid } = req.params;
    Ratings.map(async (i: any) => {
      let data: any = {
        mid: parseInt(mid),
        email: email,
        types: i.type,
        rating: i.ratings,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const result = await Movies.RatingsMovies(data);
    });
    res.status(200).json({ message: `${mid} rated by ${email}` });
  } catch (error) {
    console.error(error);
  }
}

export async function CommentMovies(req: Request, res: Response) {
  try {
    const email = req.cookies.email;
    let { mid } = req.params;
    let { comment } = req.body;
    let data: any = {
      movie_id: mid,
      user_email: email,
      comment: comment,
      parent_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await Movies.CommentMovies(data);

    res.status(200).send("The comment was added successfully");
  } catch (error) {
    console.error(error);
  }
}
export async function ReplyCommentMovies(req: Request, res: Response) {
  try {
    const email = req.cookies.email;
    let { mid, cid } = req.params;
    let { comment } = req.body;
    let data: any = {
      movie_id: mid,
      user_email: email,
      comment: comment,
      parent_id: cid,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const result = await Movies.CommentMovies(data);
    res.status(200).send("Reply  comment was added successfully");
  } catch (error) {
    console.error(error);
  }
}
