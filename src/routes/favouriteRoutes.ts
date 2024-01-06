import express, { NextFunction, Request, Response, Router } from "express";
import { favourite } from "../controllers";
import {
  authCheck,
  checkVerifyEmail,
} from "../middleware/authMiddleware";
const router: Router = express.Router();

router.post("/add-favourites", authCheck, favourite.insert);
router.post("/delete-favourites", authCheck, favourite.deleteFav);
router.get("/access-favourite-list", authCheck, favourite.getFavourties);
export default router;
