import express from "express"; 
import * as activityController from "../controllers/activity.controller.js"; 
import {authMiddleware} from "../middlewares/auth.middleware.js"; 

const activityRouter = express.Router(); 

activityRouter.use(authMiddleware);

activityRouter.get("/heatmap", activityController.getContributionHeatmap);
activityRouter.get("/feed", activityController.getActivityFeed);
activityRouter.delete("/logs", activityController.clearActivity);



export default activityRouter;  