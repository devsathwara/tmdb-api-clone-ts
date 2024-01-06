import express, { NextFunction, Request, Response, request } from "express";
import * as Movies from "../models/Movies";
import sendResponse from "../../utils/responseUtlis";
import { StatusCodes } from "http-status-codes";
export const display= async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const pageNumber: number = parseInt(req.params.pagenumber);
    const limit: any = req.query.limit;
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
    } = req.query || {};
    let keywordArray: any[];
    keywordArray = JSON.parse((keywordsID as string) || "[]");
    let genreArray: any[];
    genreArray = JSON.parse((genre as string) || "[]");
    let countriesArray: any[];
    countriesArray = JSON.parse((countries as string) || "[]");
    if (!pageNumber || isNaN(pageNumber)) {
      sendResponse(res, StatusCodes.NOT_FOUND, {
        error: "Invalid page number!",
      });
    }
    const moviesData = await Movies.getMovies(
      pageNumber,
      limit,
      genreArray || null,
      countriesArray || null,
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
      keywordArray || null
    );
    if (moviesData) {
      sendResponse(res, StatusCodes.ACCEPTED, {
        page: pageNumber,
        Movies: moviesData,
      });
    }
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
    sendResponse(res, StatusCodes.ACCEPTED, countriesRevenue);
  } catch (error: any) {
    console.error("Error:", error.message);
    sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, {
      error: "Internal Server Error",
    });
  }
};

export const getMoviesIncome = async (req: Request, res: Response) => {
  try {
    const { mid } = req.body;
    const midCheck = await Movies.checkMid(parseInt(mid));
    // (3).toFixed;

    if (!midCheck) {
      sendResponse(res, StatusCodes.NOT_FOUND, {
        message: "Movie id is not there in database",
      });
    }
    if (mid) {
      const income = await Movies.getIncome(mid);
      sendResponse(res, StatusCodes.ACCEPTED, income);
    } else {
      sendResponse(res, StatusCodes.NOT_FOUND, {
        message: "Movie id required",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
export async function getMovie(req: Request, res: Response) {
  let { mid } = req.params;
  const result = await Movies.getMovie(mid);
  if (!result) {
    sendResponse(res, StatusCodes.NOT_FOUND, {
      message: `No movie found with the given ID : ${mid}`,
    });
  }
  sendResponse(res, StatusCodes.OK, {
    Movie: result,
  });
}
