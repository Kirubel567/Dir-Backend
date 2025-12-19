import {Octokit} from "@octokit/rest";
export const createGitHubClient = (token) => {
    if(!token){
        throw new Error("GitHub token is required to create a client");
    }
    return new Octokit({
        auth: token,
    })
}

export const GITHUB_CONFIG = {
    baseURL : "https://api.github.com",
    perPage: 30,
    timeout: 10000,
};