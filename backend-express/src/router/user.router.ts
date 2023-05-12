import { userController } from "../controller/user.controller";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRouter = Router();

userRouter
    .get("/", authMiddleware.isAccessExists, userController.findUser)
    .get("/contacts", authMiddleware.isAccessExists, userController.getContacts)
    .post("/add_contact", authMiddleware.isAccessExists, userController.addContact)
    .delete("/delete_contact", authMiddleware.isAccessExists, userController.deleteContact);
