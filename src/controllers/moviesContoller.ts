import express, { NextFunction, Request, Response, request } from "express";
import { getMoviesbyPage } from "../models/Movies";
export const displayMoviesbyPages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const pageNumber: number = parseInt(req.params.pagenumber);
    if (!pageNumber || isNaN(pageNumber)) {
      return res.status(400).send({ error: "Invalid page number!" });
    }
    const moviesData = await getMoviesbyPage(pageNumber);
    if (moviesData) {
      return res.json({ page: pageNumber, Movies: moviesData });
    }
  } catch (error) {
    console.error(error);
  }
};
