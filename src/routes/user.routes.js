import express from "express";
import { exposeMe } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

//user route to /me
userRouter.get("/me", authMiddleware, exposeMe);

export default userRouter;