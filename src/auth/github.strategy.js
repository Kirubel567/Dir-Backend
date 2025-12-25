import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/user.model.js";

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            //find if user already is present 
            let user = await User.findOne({ githubId: profile.id });
            if(!user){
                //create a new user 
                user = await User.create({
                    githubId: profile.id,
                    githubUsername: profile.username,
                    email: profile.emails?.[0]?.value,
                    avatarUrl: profile.photos?.[0]?.value,
                    profileUrl: profile.profileUrl,
                    lastLogin: new Date(),
                });
            } else {
                //update last login
                user.lastLogin = new Date();
                await user.save();
            } 
            return cb(null, user);
        } catch (err) {
            return cb(err, null);
        }
    }
));
