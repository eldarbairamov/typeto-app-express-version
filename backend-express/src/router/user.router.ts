import { Router } from "express";
import { authMiddleware } from "../middleware";
import { userController } from "../controller";
import { fileMiddleware } from "../middleware/file.middleware";

export const userRouter = Router();

userRouter
    .get("/", authMiddleware.isAccessExists, userController.findUser)
    .get('/get_current_user', authMiddleware.isAccessExists, userController.getCurrentUser)
    .patch("/avatar", authMiddleware.isAccessExists, fileMiddleware.imageChecker, userController.uploadAvatar)
    .delete("/avatar", authMiddleware.isAccessExists, userController.deleteAvatar)
    .get("/contacts", authMiddleware.isAccessExists, userController.getContacts)
    .post("/add_contact", authMiddleware.isAccessExists, userController.addContact)
    .delete("/delete_contact", authMiddleware.isAccessExists, userController.deleteContact);
