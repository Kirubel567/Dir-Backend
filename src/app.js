import express from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import passport from "./config/passport.js";
import {
  routeNotFound,
  globalErrorHandler,
} from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.routes.js";

//configure dotenv 
dotenv.config();

const app = express();


//middlewares
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.GITHUB_SESSION_SECRET || "default_secret_replacement_needed",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.get("/api/auth/github", passport.authenticate("github", { scope: ["user:email", "read:user", "repo", "workflow", "delete_repo"] }));

app.get(
  "/api/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:5500/test.html"); // will be changed later
  }
);

app.post("/api/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

//routes
app.use("/api/users", userRouter);

//global and 404 error handling middlewares
app.use(routeNotFound);
app.use(globalErrorHandler);

export default app;