import express from "express";
import session from "express-session";
import asyncHandler from "express-async-handler";
import passport from "passport";
import dotenv from "dotenv";
import {routeNotFound, globalErrorHandler,} from "./middlewares/error.middleware.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import "./auth/passport.js"; //serialization and deserliazation logic
import "./auth/jwt.strategy.js"; //jwt strategy
import userRouter from "./routes/user.routes.js";
import repoRouter from './routes/repository.routes.js';
import activityRouter from "./routes/activity.routes.js"; 

//configure dotenv 
dotenv.config();

//create express app
const app = express(); 

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

//session middleware
app.use(session({
  name: "dir.sid",
  secret: process.env.JWT_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, //true if it's https
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//routes middlewares
app.use("/auth", authRouter);
app.use("/api/repos", repoRouter); 
app.use("/api", userRouter);
app.use("/api/activity", activityRouter);


//routes
// Routes (auth routes added in Phase 3)
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

//global and 404 error handling middlewares
app.use(routeNotFound);
app.use(globalErrorHandler);

export default app;