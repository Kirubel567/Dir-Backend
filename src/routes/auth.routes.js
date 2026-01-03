import { Router } from "express";
import passport from "passport";
import env from "dotenv";
import { githubAuthCallback, logout } from "../controllers/auth.controller.js";

env.config();

const authRouter = Router();

//starting github authentication, github login
authRouter.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email", " read:user", "repo", "workflow", "delete_repo"],
  })
);

//github callback url
authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
  }),
  githubAuthCallback
);

//endpoint to logout
authRouter.post("/logout", logout);
export default authRouter;
