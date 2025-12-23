import express from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/betterAuth.js";
import {
  routeNotFound,
  globalErrorHandler,
} from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.routes.js";
//configure dotenv 
dotenv.config();
// import cors from "cors";

const app = express(); 

//middlewares
app.use(express.json());

//routes
// app routes
app.use("/api/users", userRouter);

//global and 404 error handling middlewares
app.use(routeNotFound);
app.use(globalErrorHandler);

export default app;
