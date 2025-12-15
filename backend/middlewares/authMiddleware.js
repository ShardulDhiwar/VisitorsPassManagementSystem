import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check header exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;
