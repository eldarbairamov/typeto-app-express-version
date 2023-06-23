import { Router } from "express";
import { userController } from "../controller";
import { authMiddleware, commonMiddleware, fileMiddleware } from "../middleware";

export const userRouter = Router();

userRouter
    .get(
        "/",
        authMiddleware.isAccessExists,
        userController.findUser
    )
    .get(
        "/get_current_user",
        authMiddleware.isAccessExists,
        userController.getCurrentUser
    )
    .patch(
        "/avatar",
        authMiddleware.isAccessExists,
        fileMiddleware.imageChecker,
        userController.uploadAvatar
    )
    .delete(
        "/avatar",
        authMiddleware.isAccessExists,
        userController.deleteAvatar
    )
    .get(
        "/contacts",
        authMiddleware.isAccessExists,
        userController.getContacts
    )
    .post(
        "/contacts",
        authMiddleware.isAccessExists,
        commonMiddleware.isRequestEmpty,
        userController.addContact
    )
    .delete(
        "/contacts",
        authMiddleware.isAccessExists,
        userController.deleteContact
    );
