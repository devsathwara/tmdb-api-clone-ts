import express, { NextFunction, Request, Response, Router } from "express";
import { chart } from "../controllers";
const router: Router = express.Router();
router.get("/chart-movies/:id", chart.MoviesChart);
router.get("/chart-movies", chart.MoviesChart);

export default router;
