import {Router} from "express";
import passport from "passport";
import env from "dotenv";

env.config();

const authRouter = Router();

//starting github authentication, github login
authRouter.get("/github", passport.authenticate("github", {scope: ["user:email"]}));

//github callback url
authRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: true,
  }),
  (req, res) => {
    res.status(200).json({message: "GitHub authentication successful", user: req.user});
  }
);


//endpoint to logout
authRouter.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.clearCookie("dir.sid");
            res.status(200).json({message: "Logged out successfully"});
        });
    });
});
export default authRouter;