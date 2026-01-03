import passport from "passport";
import { User } from "../models/user.model.js";
import "./github.strategy.js";

//serialize user id
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
//deserialze from session
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
});

export default passport;
