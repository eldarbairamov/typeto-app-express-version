import { Router } from "express";
import { authController } from "../controller/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { commonMiddleware } from "../middleware/common.middleware";

export const authRouter = Router();

authRouter
    .post(
        "/registration",
        commonMiddleware.isRequestEmpty,
        authMiddleware.isEmailUnique,
        authController.registration)
    .post(
        "/login",
        commonMiddleware.isRequestEmpty,
        authMiddleware.isUserExists,
        authController.login)
    .post(
        "/forgot_password",
        commonMiddleware.isRequestEmpty,
        authMiddleware.isUserExists,
        authController.forgotPassword)
    .post(
        "/reset_password",
        commonMiddleware.isRequestEmpty,
        authController.resetPassword)
    .get(
        "/logout",
        authMiddleware.isAccessExists,
        authController.logout)
    .post(
        "/refresh",
        authController.refresh);
