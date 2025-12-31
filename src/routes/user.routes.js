import express from "express";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get('/me', authMiddleware, userController.getMe);
userRouter.get('/stats', authMiddleware, userController.getUserStats);
userRouter.patch('/profile', authMiddleware, userController.updatedProfile);


export default userRouter;