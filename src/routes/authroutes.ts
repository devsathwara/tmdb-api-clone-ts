import express, { NextFunction, Request, Response, Router } from "express";
import * as userController from "../controllers/userController";
const router: Router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);

export default router;
