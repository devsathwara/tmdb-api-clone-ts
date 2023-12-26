import express, { NextFunction, Request, Response, request } from "express";
import { getMoviesbyPage } from "../models/Movies";
export const displayMoviesbyPages = async (
  pageNumber: Number
): Promise<any> => {
  try {
    const movies = await getMoviesbyPage(pageNumber);
    return movies;
  } catch (error) {
    console.error(error);
  }
};
