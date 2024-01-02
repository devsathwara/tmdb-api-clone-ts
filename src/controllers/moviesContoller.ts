import express, { NextFunction, Request, Response, request } from "express";
import * as Movies from "../models/Movies";
export const displayMoviesbyPages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const pageNumber: number = parseInt(req.params.pagenumber);
    if (!pageNumber || isNaN(pageNumber)) {
      return res.status(400).send({ error: "Invalid page number!" });
    }
    const moviesData = await Movies.getMoviesbyPage(pageNumber);
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
// export const insertFavourites = async (req: Request, res: Response) => {
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
    const midCheck = await Movies.checkMid(parseInt(mid));

    if (!midCheck) {
      return res.status(400).send("Movie id is not there in database");
    }
    const result = await Movies.insertFavourites(userEmail, mid);
    if (result.rows.length == 0) {
      return res.json({ message: `${mid} already there in  your Favorites` });
    }
    return res.json({ message: `${mid} added to your Favorites` });
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
      const data = await Movies.GenremoviesReleasedin3Years(id);
      // data.rows.map((i) => {
      //   console.log(i.ReleaseYear);
      // });
      return res.json(data.rows);
    }
    const releasedMovies = await Movies.moviesReleasedin3Years();
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
      const income = await Movies.getProfitLossMoviesbyId(mid);
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
    // const midCheck = await Movies.checkmid(parseInt(mid));
    // // (3).toFixed;
    // if (midCheck) {
    //   return res.status(400).send("Movie id is not there in database");
    // }
    // const userFavouritecheck = await Movies.checkWatchList(userEmail);
    // userFavouritecheck.forEach((id: any) => {
    //   // if (parseInt(id.toString()) === parseInt(mid)) {
    //   //   return res.json({ message: "This movie is already Favourites" });
    //   // }
    //   // console.log(id);
    //   let favouritesArray = id.mid === null ? [] : JSON.parse(id.mid);
    //   if (favouritesArray.includes(parseInt(mid))) {
    //     return res.json({ message: "Already in the Watch list" });
    //   }
    // });
    // const userFavoriteList = await Movies.updateWatchList(userEmail, mid, id);
    // return res.json({ message: `${mid} added to your Watch list` });
    const result = await Movies.insertMoviesWatchlist(userEmail, mid, id);
    // console.log(result);
    if (result.rows.length == 0) {
      return res.json({
        message: `${mid} is already there in ${id} WatchList`,
      });
    }
    return res
      .status(200)
      .json({ message: `${mid} is inserted to ${id} WatchList` });
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
    return res.json({ message: "Deleted from Your Watch list" });
  } catch (error) {
    console.error(error);
  }
};
export const accessWatchListpublic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data: any = await Movies.shareWatchlist(id);
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
  const email = req.cookies.email;
  const { id } = req.params;

  const result = await Movies.deleteWatchList(email, id);
  if (!result) {
    return res.status(400).json({ message: "Failed to Update the Name" });
  } else {
    return res.status(200).json({ message: "Delete Successfully!" });
  }
}
