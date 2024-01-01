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
export const createFavouriteList = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { name } = req.body;
    if (!name) {
      return res.json({ message: "List name required" });
    }
    const email = req.cookies.email;
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
export const insertFavourites = async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const { mid } = req.body;
    const midCheck = await Movies.checkmid(parseInt(mid));
    // (3).toFixed;

    if (midCheck.length == 0) {
      return res.status(400).send("Movie id is not there in database");
    }
    const userFavouritecheck = await Movies.checkFavourites(userEmail);
    userFavouritecheck.forEach((id: { favourites: string | null }) => {
      // if (parseInt(id.toString()) === parseInt(mid)) {
      //   return res.json({ message: "This movie is already Favourites" });
      // }
      // console.log(id);
      let favouritesArray =
        id.favourites === null ? [] : JSON.parse(id.favourites);
      if (favouritesArray.includes(parseInt(mid))) {
        return res.json({ message: "Already in the Favorites" });
      }
    });
    const userFavoriteList = await Movies.updateFavourites(userEmail, mid);
    return res.json({ message: `${mid} added to your Favourites` });
  } catch (error) {
    console.error(error);
  }
};
export const deleteFavourite = async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const { mid } = req.body;
    const deleteFav = await Movies.deleteFavourite(mid, userEmail);
    return res.json({ message: "Deleted from Your Favourites" });
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
    const releasedMovies = await Movies.moviesReleasedin3Years();
    return res.status(200).json(releasedMovies);
  } catch (error) {
    console.error(error);
  }
};
