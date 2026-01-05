import { Repository } from "../models/repository.model.js";
import GitHubEvent from "../models/githubEvents.model.js";
import { verifyGithubSignature } from "../utils/webhook.util.js";
import { createLog } from "../utils/activity.util.js";
import { invalidateRepoCache } from "../utils/cache.util.js";
import { StatusCodes } from "http-status-codes";

export const handleGithubWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-hub-signature-256"];
    const eventType = req.headers["x-github-event"];
    const payload = req.body;

    //find the specific workspace using the payload
    const githubId = payload.repository.id.toString();
    const repo = await Repository.findOne({ githubId });

    if (!repo) {
      return res.status(StatusCodes.OK).send("Workspace not found in Dir");
    }

    //check that the request is really coming from github itself
    const isValid = verifyGithubSignature(
      signature,
      payload,
      repo.webhookSettings.secret
    );
    if (!isValid) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Invalid signature.");
    }

    //save raw event (all the payload that come from github for future reference)
    await GitHubEvent.create({
      repoId: repo._id,
      eventType: eventType,
      actorUsername: payload.sender.login,
      payload: payload,
    });

    //handle different evetns to log into activity log
    let logMessage = "";
    switch (eventType) {
      case "push":
        await invalidateRepoCache(repo.ownerId, repo._id);
        logMessage = `pushed to ${payload.ref.split("/").pop()}`;
        break;
      case "issue":
        logMessage = `${payload.action} issue: ${payload.issue.title}`;
        break;
      case "star":
        logMessage = `starred the repository`;
    }

    if (logMessage) {
      await createLog(
        repo.ownerId,
        repo._id,
        `github_${eventType}`,
        "repository",
        repo._id,
        `GitHub: ${payload.sender.login} ${logMessage}`
      );
    }

    res.status(StatusCodes.OK).send("Webhook processed successfully.");
  } catch (err) {
    console.error("Webhook Error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Webhook processing failed.");
  }
};
