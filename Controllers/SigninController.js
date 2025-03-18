require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");

// Login User
const SigninController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.error("❌ User not found");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("❌ Password does not match");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: "7d" }
        );

        

        // ✅ Return Response
        return res.status(200).json({
            message: "Login successful",
            token, // ✅ Token should be sent here
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                profilePhoto: user.profilePhoto,
                role: user.role,
                agno:user.agno
            }
        });
    } catch (error) {
        console.error("❌ Error in SigninController:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { SigninController };
