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
