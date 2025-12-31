import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import { Repository } from "../models/repository.model.js";
import { Notification } from "../models/notification.model.js";
//@desc   Get user profile after authentication
export const getMe = async (req, res) => {
  try {
    const userId = req.user._id;
    //populate the repose
    const user = await User.findById(userId)
      .populate("reposOwned")
      .select("-__v");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "User not found" });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
};

//@desc get user statistics
//@route GET /api/user/stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    //count number of repositories owned
    //count the number documents in Repository collection with ownerId as userId
    const [activeWorkspacesCount, unreadNotifications] = await Promise.all([
      Repository.countDocuments({ ownerId: userId }),
      Notification.countDocuments({ userId: userId, isRead: false }),
    ]);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        activeWorkspacesCount,
        unreadNotifications,
        totalTasks: 0,
        role: req.user.role,
      },
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
};

// @dec update profile sttings and preferences
//@route PUT /api/user/profile
export const updatedProfile = async (req, res) => {
  try {
    const { bio, theme, notificationsEnabled, emailNotifications } = req.body;
    const updatedData = {};

    if (bio !== undefined) updatedData.bio = bio;
    if (theme !== undefined) updatedData["preferences.theme"] = theme;
    if (notificationsEnabled !== undefined)
      updatedData["preferences.notificationsEnabled"] = notificationsEnabled;
    if (emailNotifications !== undefined)
      updatedData["preferences.emailNotifications"] = emailNotifications;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updatedData,
      },
      { new: true, runValidators: true }
    ).select("-__v");

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser.pre,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: error.message,
    });
  }
};
