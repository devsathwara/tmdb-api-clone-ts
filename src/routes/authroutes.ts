import express, { NextFunction, Request, Response, Router } from "express";
import * as userController from "../controllers/userController";
import { authCheck, checkVerifyemail } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", checkVerifyemail, userController.loginUser);
router.get("/logout", userController.logoutUser);
router.get("/verify-email/:token", userController.verifyEmail);
router.get("/forgot-password", userController.forgotPassword);
router.get("/reset-password/:token", userController.resetPassword);
router.get("/change-password", authCheck, userController.changePassword);
export default router;
