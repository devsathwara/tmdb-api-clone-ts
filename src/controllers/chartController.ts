import express, { NextFunction, Request, Response, request } from "express";
import { chart } from "../models/index";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/responseUtlis";
StatusCodes;
export const MoviesChart = async (req: Request, res: Response) => {
  try {
    const { id }: any = req.params;
    if (id) {
      const data = await chart.GenreChart(id);
      return res.json(data.rows);
    }
    const releasedMovies = await chart.MoviesChart();
    sendResponse(res, StatusCodes.ACCEPTED, releasedMovies);
  } catch (error) {
    console.error(error);
  }
};
