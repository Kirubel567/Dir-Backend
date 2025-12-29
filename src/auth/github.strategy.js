import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/user.model.js";
import {Repository} from "../models/repository.model.js";
import { Notification } from "../models/notification.model.js";
import axios from "axios"
import crypto from "crypto"

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
            try {

                // Initial user upsert
                let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                // If email is missing from profile, fetch it manually from GitHub's email API
                if (!email) {
                    const emailRes = await axios.get("https://api.github.com/user/emails", {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });
                    // Find the primary email, or just take the first one available
                    const primaryEmail = emailRes.data.find(e => e.primary) || emailRes.data[0];
                    email = primaryEmail ? primaryEmail.email : null;
                }

                if (!email) {
                        return cb(new Error("Email is required from GitHub profile"), null);
                }

                //create or finding user
                let user = await User.findOne({ githubId: profile.id });

                // id migration safety 
                if (!user) {
                    user = await User.findOne({ githubUserName: profile.username });
                }

                // creating new user
                if (!user) {
                    user = new User({
                        githubId: profile.id,
                        email: email,
                    });
                }

                //updating user data

                user.githubId = profile.id;
                user.githubUsername = profile.username;
                user.avatarUrl = profile.photos?.[0]?.value || '';
                user.profileUrl = profile.profileUrl;
                user.lastLogin = new Date();

                await user.save();


                //fetching repos from github API
                const repoRes = await axios.get("https://api.github.com/user/repos", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    params: {
                        type: 'owner',
                        sort: 'updated',
                        per_page:100
                    }
                });

                

                const reposObjectIds = await Promise.all(repoRes.data.map( async (repo) => {
                    const r = await Repository.findOneAndUpdate(
                        {name: repo.full_name}, // using repo's full name for unique identification
                        {
                            name: repo.full_name,
                            description: repo.description,
                            ownerId: user._id, // linking to the user first saved
                        },
                        {upsert: true, new:true}

                    );

                    return r._id
                }
                ));

                user.reposOwned = reposObjectIds;

                // Handling Notification

                // create a welcome notification as first one when repo is synced
                if(reposObjectIds.length > 0 && user.notifications.length === 0){
                    const welcomeNote = await Notification.create({
                        userId: user._id,
                        message: `Successfully linked ${reposObjectIds.length} repositories from GitHub.`,
                        type: "message",
                        repoId: reposObjectIds[0],
                        targetType: "repository",
                        targetId: reposObjectIds[0],
                        isRead:false,
                    });

                    //pushing this notification
                    user.notifications.push(welcomeNote._id);

                }
               

                await user.save();
                return cb(null, user);
        } catch (err) {
            console.error("Auth Error: ", err)
            return cb(err, null);
        }
    }
));
