import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import crypto from 'crypto';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import axios from 'axios';
import { type } from 'os';

dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user._id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.MAIN_URL ? `${process.env.MAIN_URL}/api/auth/github/callback` : '/api/auth/github/callback',
            scope: ['user:email', 'read:user', 'repo', 'workflow', 'delete_repo'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
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

                const reposOwned = repoRes.data.map(repo => repo.full_name);
                // Check if user exists by GitHub ID
                let user = await User.findOne({ gitHubID: profile.id });

                // Also check by username if not found by ID (migration safety)
                if (!user) {
                    user = await User.findOne({ githubUserName: profile.username });
                }

                // Create new user
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                if (!email) {
                        return done(new Error("Email is required from GitHub profile"), null);
                }

                const userData = {
                        
                        name: profile.displayName || profile.username,
                        email: email,
                        image: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                        githubUserName: profile.username,
                        gitHubID: profile.id,
                        emailVerified: true, // OAuth usually implies verified
                        reposOwned: reposOwned
                    };
                    
                if(user){
                    user.set(userData);
                    await user.save();
                }else{
                    user = new User({
                        _id: crypto.randomUUID(),
                        ...userData
                    });
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                console.error("Authetication Error: ", err.response?.data || err.message);
                return done(err, null);
            }
        
    )
);

export default passport;
