// Import the User model to fetch user data from the database
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"; 

// Middleware function to protect routes (ensures only authenticated users can access)
const protectRoute = async (req, res, next) => {
    try {
        // Extract the JWT token from the request cookies
        const token = req.cookies.jwt;
        
        // If no token is found, return a 401 Unauthorized response
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        // Verify the token using the secret key stored in environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database using the decoded userId from the token
        // Exclude the password field for security reasons
        const user = await User.findById(decoded.userId).select("-password");

        // Attach the user object to the request object for use in the next middleware or route handler
        req.user = user;

        // Call the next function to proceed to the next middleware or route
        next();
    } catch (err) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ message: err.message });
    }
};


export default protectRoute;
