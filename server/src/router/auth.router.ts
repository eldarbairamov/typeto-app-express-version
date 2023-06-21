import { Router } from "express";
import { authMiddleware, commonMiddleware } from "../middleware";
import { authController } from "../controller";

export const authRouter = Router();

authRouter
    .post(
        "/registration",
        commonMiddleware.isRequestEmpty,
        authMiddleware.isEmailUnique,
        authController.registration
    )
    .post(
        "/login",
        commonMiddleware.isRequestEmpty,
        authMiddleware.isUserExists,
        authController.login
    )
    .post(
        "/forgot_password",
        commonMiddleware.isRequestEmpty,
        authMiddleware.isUserExists,
        authController.forgotPassword
    )
    .patch(
        "/reset_password",
        commonMiddleware.isRequestEmpty,
        authController.resetPassword
    )
    .delete(
        "/logout",
        authMiddleware.isAccessExists,
        authController.logout
    )
    .post(
        "/refresh",
        authController.refresh
    );
