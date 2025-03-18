const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    agno: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, default: "" }, // Cloudinary URL for user photo
    role: { type: String, enum: ["student", "cr"], default: "student" }, // Default is Student

    // ✅ Password Reset Fields
    resetPasswordToken: { type: String }, // Stores the hashed token
    resetPasswordExpires: { type: Date },  // Stores the token expiration time

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
