require("dotenv").config();
const jwt = require("jsonwebtoken");
const CrEmail = require("../Models/CrSchema");

const protect = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        // ✅ Ensure token starts with "Bearer "
        if (!token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // ✅ Extract actual token
        token = token.split(" ")[1];

        // ✅ Verify token & handle possible errors
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = decoded; // Attach user data to request

        // ✅ Only query database if role is not included in token
        if (!req.user.role) {
            const isCR = await CrEmail.findOne({ email: req.user.email });
            req.user.role = isCR ? "cr" : "student";
        }

        next(); // Continue to next middleware/controller
    } catch (error) {
        console.error("Middleware Error:", error.message); // Debugging
        res.status(500).json({ message: "Server error in authentication" });
    }
};

module.exports = protect;
