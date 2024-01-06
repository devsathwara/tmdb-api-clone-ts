import express, { NextFunction, Request, Response, request } from "express";
import { favourite, movies } from "../models/index";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";
export const insert = async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const { mid } = req.body;
    const midCheck = await movies.checkMid(mid);
    if (!midCheck) {
      sendResponse(res, StatusCodes.BAD_REQUEST, {
        message: "Movie id is not there in database",
      });
    }
    const result = await favourite.insert(userEmail, mid);
    if (result.numAffectedRows) {
      sendResponse(res, StatusCodes.ACCEPTED, {
        message: `${mid} added to your Favorites`,
      });
    } else {
      sendResponse(res, StatusCodes.CONFLICT, {
        message: `${mid} already in your Favorites`,
      });
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      error: "Internal Server Error",
    });
  }
};

export const deleteFav= async (req: Request, res: Response) => {
  try {
    const userEmail = req.cookies.email;
    const { mid } = req.body;
    const result: any = await favourite.deleteFav(mid, userEmail);
    sendResponse(res, StatusCodes.ACCEPTED, {
      message: `${mid} deleted from favourites`,
    });
  } catch (error) {
    console.error(error);
  }
};
export const getFavourties = async (req: Request, res: Response) => {
  const { email } = req.cookies;
  const favouritesId = await favourite.check(email);
  const moviesArr: any[] = [];
  await Promise.all(
    favouritesId.map(async (i: any) => {
      let arr = JSON.parse(i.favourites);
      const moviePromises = arr.map(async (i: any) => {
        const movie = await movies.getMovie(i);
        return movie;
      });
      moviesArr.push(...(await Promise.all(moviePromises)));
    })
  );
  sendResponse(res, StatusCodes.ACCEPTED, { FavouritesMovies: moviesArr });
};
