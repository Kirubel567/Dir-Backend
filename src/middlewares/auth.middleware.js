import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: ReasonPhrases.UNAUTHORIZED });
};