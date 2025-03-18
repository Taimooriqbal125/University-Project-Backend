require("dotenv").config();
const User = require("../Models/UserSchema");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const ForgetPassController = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(process.env.JWT_SECRET)



        // ✅ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // ✅ Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // ✅ Create password reset link
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        // ✅ Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // ✅ Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <h3>Password Reset</h3>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link is valid for 1 hour.</p>
            `
        };

        // ✅ Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset email sent!" });

    } catch (error) {
        console.error("❌ Error in Forgot Password:", error);
        res.status(500).json({ message: "Error sending password reset email", error });
    }
};


const ResetPassController = async (req, res) => {
    console.log("🟢 ResetPassController HIT");

    try {
        const { token, newPassword } = req.body;
        console.log(process.env.JWT_SECRET)
        console.log("Received Token:", token);

        // ✅ Verify the reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Find user by ID
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // ✅ Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // ✅ Save new password in DB
        await user.save();

        res.status(200).json({ message: "Password reset successful!" });

    } catch (error) {
        console.error("❌ Error in Reset Password:", error);
        res.status(500).json({ message: "Error resetting password", error })
    }
};

const PasswordController = {
    ForgetPassController,
    ResetPassController
};

module.exports = PasswordController;

