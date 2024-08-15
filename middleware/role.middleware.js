import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespose.js";
import asynchandler from "../utils/asynchandler.js";

// The middleware function to check roles
const roleMiddleware = (requiredRoles) => {
    return asynchandler(async (req, res, next) => {
        const user = req.user; // This should be set by the authentication middleware

        // If no user is found, return an error
        if (!user) {
            throw new ApiError(401, "User not authenticated");
        }

        // Check if the user's role is in the requiredRoles array
        if (!requiredRoles.includes(user.role)) {
            throw new ApiError(403, "You do not have permission to access this resource");
        }

        // If the user has the required role, proceed to the next middleware/controller
        next();
    });
};

export default roleMiddleware;
