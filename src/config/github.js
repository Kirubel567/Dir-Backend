import { Octokit } from "@octokit/rest";
import  {throttling}  from "@octokit/plugin-throttling"; //to prevent rate limit when many requests

const ThrottledOctokit = Octokit.plugin(throttling);

export const createGitHubClient = (token) => {
  if (!token) {
    throw new Error("GitHub token is required to create a client");
  }
  return new ThrottledOctokit({
    auth: token,
    throttle: {
      onRateLimit: (retryAfter, options) => {
        console.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );
        // Retry once after hitting a rate limit
        if (options.request.retryCount === 0) {
          console.log(`Retrying request after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (retryAfter, options) => {
        console.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`
        );
      },
    },
  });
};

export const GITHUB_CONFIG = {
  baseURL: "https://api.github.com",
  perPage: 30,
  timeout: 10000,
};
