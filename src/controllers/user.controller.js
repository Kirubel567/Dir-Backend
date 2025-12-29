import { StatusCodes } from "http-status-codes";

export const exposeMe = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

