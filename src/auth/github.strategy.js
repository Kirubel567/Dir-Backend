import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/user.model.js";
import { Repository } from "../models/repository.model.js";
import { Notification } from "../models/notification.model.js";
import axios from "axios";
import crypto from "crypto";
import { repositoryService } from "../services/github.service.js";
import { createGitHubClient } from "../config/github.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let email = profile.emails?.[0]?.value || null;

        if (!email) {
          const octokit = createGitHubClient(accessToken);
          const emailRes =
            await octokit.rest.users.listEmailsForAuthenticatedUser();
          const primaryEmail =
            emailRes.data.find((e) => e.primary) || emailRes.data[0];
          email = primaryEmail ? primaryEmail.email : null;
        }

        const totalRepos =
          (profile._json.public_repos || 0) +
          (profile._json.total_private_repos || 0);

        let user = await User.findOne({ githubId: profile.id });
        const isNewUser = !user;

        if (isNewUser) {
          user = new User({
            githubId: profile.id,
            email: email,
            githubUsername: profile.username,
            avatarUrl: profile.photos?.[0]?.value || "",
            profileUrl: profile.profileUrl,
            githubRepoCount: totalRepos,
            lastLogin: new Date(),
          });
        } else {
          // Update existing user data
          user.githubUsername = profile.username;
          user.email = email;
          user.avatarUrl = profile.photos?.[0]?.value || "";
          user.githubRepoCount = totalRepos;
          user.lastLogin = new Date();
        }

        // Only create the welcome notification if it's a brand new user
        if (isNewUser && totalRepos > 0) {
          const welcomeNote = await Notification.create({
            userId: user._id,
            message: `Welcome! We found ${totalRepos} repositories on your GitHub. Head over to Discovery to import your first workspace.`,
            type: "message",
            isRead: false,
            targetType: "system",
          });

          user.notifications.push(welcomeNote._id);
        }

        await user.save();

        user.accessToken = accessToken;
        return cb(null, user, { accessToken });
      } catch (err) {
        console.error("Auth Error: ", err);
        return cb(err, null);
      }
    }
  )
);
