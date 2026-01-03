import { User } from "../models/user.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { Repository } from "../models/repository.model.js";
import { StatusCodes } from "http-status-codes";

//@desc: global activity feed - dashboard timeline
// @route : GET /api/activity/feed

export const getActivityFeed = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user._id;

        // getting ids of all workspaces
        const userWorkspaces = await Repository.find({ "members.user": userId }).select("_id");
        const workspaceIds = userWorkspaces.map(repo => repo._id);

        const logs = await ActivityLog.find({
            $or: [
                { repoId: { $in: workspaceIds } },
                { userId: userId }
            ]
        }).populate("userId", "githubUsername avatarUrl")
            .populate("repoId", "name")
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((page - 1) * limit);

        const totalLogs = await ActivityLog.countDocuments({ userId: req.user._id })
        // response
        const formattedLogs = logs.map(log => ({
            id: log._id,
            user: log.userId?.githubUsername || "Unknown User",
            action: log.action,
            targetName: log.repoId?.name || "repository",
            targetType: log.targetType,
            message: log.details?.message || "",
            timestamp: log.createdAt,
            iconType: log.targetType,
        }))

        res.status(StatusCodes.OK).json({
            status: "success",
            data: formattedLogs,
            pagination: {
                currentPage: parseInt(page),
                hasNextPage: ((page - 1) * limit) + logs.length < totalLogs,
                totalPages: Math.ceil(totalLogs / limit)
            }
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "error", message: error.message });
    }
}
//@desc: global activity feed
// @route : GET /api/repos/:repoId/activity

export const getRepoActivity = async (req, res) => {
    try {
        const { id: repoId } = req.params;
        const { page = 1 } = req.query;

        const logs = await ActivityLog.find({ repoId })
            .populate("userId", "githubUsername")
            .sort({ createdAt: -1 })
            .limit(10)
            .skip((page - 1) * 10);

        res.status(StatusCodes.OK).json({ status: "success", data: logs });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "error", message: error.message });
    }

}

//@desc: clear activity
// @route : DELETE /api/activity/logs

export const clearActivity = async (req, res) => {
    try {
        await ActivityLog.deleteMany({ userId: req.user._id });
        res.status(StatusCodes.OK).json({ status: "success", message: "History cleared" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "error", message: error.message });
    }
};

//@desc: geting contribution heatmap
// @route : GET /api/activity/heatmap

export const getContributionHeatmap = async (req, res) => {
    try {
        const userId = req.user._id;

        //calculating the date for one year ago today - mirroring github
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

        const heatmapData = await ActivityLog.aggregate([
            {
                //filtering logs only from past year
                $match: {
                    userId: userId,
                    createdAt: { $gte: oneYearAgo }
                }
            },
            {
                // group by date
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }

                }
            }, {
                //sorting chronologically
                $sort: {
                    "_id": 1
                }
            }
        ]);

        res.status(StatusCodes.OK).json({
            status: "success",
            data: heatmapData
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: error.message
        });
    }
}
