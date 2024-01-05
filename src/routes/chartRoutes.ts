import express, { NextFunction, Request, Response, Router } from "express";
import { chart } from "../controllers";
const router: Router = express.Router();
router.get("/chart-movies/:id", chart.moviesReleasedin3Years);
router.get("/chart-movies", chart.moviesReleasedin3Years);

export default router;
