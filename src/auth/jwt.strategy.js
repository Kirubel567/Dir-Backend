import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/user.model.js";
import passport from "passport";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        user.accessToken = jwt_payload.accessToken;
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      console.error("JWT Error: ", error);
      return done(error, false);
    }
  })
);
