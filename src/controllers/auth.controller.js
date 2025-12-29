import jwt from "jsonwebtoken";
import statusCodes from "http-status-codes";

export const githubAuthCallback = (req,res)=> {
    try {
        const user = req.user;

        if(!user){
            return res.status(statusCodes.UNAUTHORIZED).json({status: "error", message: "Auth failed"})
        }
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        // res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`) for later linking
        res.status(statusCodes.OK).json({
            status: "success",
            message: "GitHub Auth successful",
            token,
            user:{
                id: user._id,
                username: user.githubUsername,
                email:user.email
            }
        })
    } catch (error) {
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({status: "error", message: "Auth failed"})
    }
}

export const logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        if(req.session) {
            req.session.destroy(() => {
            res.clearCookie("dir.sid");
            res.status(200).json({message: "Logged out successfully"});
        });
        }else{
            res.clearCookie("dir.sid");
            res.status(200).json({message: "Logged out successfully"});
        }
    });
};