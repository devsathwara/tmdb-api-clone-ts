import express, { NextFunction, Request, Response, Router } from "express";
import * as userController from "../controllers/authController";
import { authCheck } from "../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/verify-email/:token", userController.verifyEmail);
router.get("/forgot-password", userController.forgotPassword);
router.get("/reset-password/:token", userController.resetPassword);
router.post("/change-password", authCheck, userController.changePassword);
export default router;
