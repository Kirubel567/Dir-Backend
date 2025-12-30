import { Repository } from "../models/repository.model.js";
import {createGitHubClient} from '../config/github.js';

export const repositoryService = {
  syncUserRepos: async (user, accessToken) => {
    try {
      // initialize oktokit instance 
      const octokit = createGitHubClient(accessToken);
      // Fetch user repositories from GitHub
      const repoRes = await octokit.rest.repos.listForAuthenticatedUser({
        type: "owner",
        sort: "updated",
        per_page: 100,
      });

      const reposObjectIds = await Promise.all(
        repoRes.data.map(async (repo) => {
          const r = await Repository.findOneAndUpdate(
            { name: repo.full_name }, // using repo's full name for unique identification
            {
              name: repo.full_name,
              description: repo.description,
              ownerId: user._id, // linking to the user first saved
              url: repo.html_url,
              isPrivate: repo.private,
              language: repo.language,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true}
          );

          return r._id;
        })
      );
      user.reposOwned = reposObjectIds;
      await user.save();
      return reposObjectIds;
    } catch (error) {
      console.error("Octokit Repo Sync error:", error.message);
      throw error;
    }
  },
};
