const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");
const CrEmail = require("../Models/CrSchema");
const cloudinary = require("../config/cloudinaryconfig"); // Import Cloudinary config
const fs = require("fs"); // File System to delete temp files

// Register User with Profile Photo Upload
const SignupController = async (req, res) => {
    console.log("🚀 SignupController hit!");
    console.log("📂 Received File:", req.file);
    console.log("📩 Received Body:", req.body);

    try {
        const { agno, email, username, password } = req.body;
        let profilePhoto = ""; // Default empty profile photo

        // If user uploaded a profile photo, manually upload to Cloudinary
        console.log("📂 Received File:", req.file); // ✅ Logs the uploaded file from Multer
        console.log("📩 Received Body:", req.body); // ✅ Logs the text fields from the request
        
        if (req.file) {  // ✅ Checks if a file was uploaded
            console.log("☁ Uploading to Cloudinary...");
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "Uploads" }); // ✅ Uploads file to Cloudinary
            profilePhoto = result.secure_url;  // ✅ Stores Cloudinary URL
            console.log("✅ Cloudinary Upload Success:", profilePhoto);
        
            fs.unlinkSync(req.file.path); // ✅ Deletes the temporary file after upload
            console.log("🗑️ Temp File Deleted.");
        }
        

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

         // 🔥 **Check if email exists in CrEmail collection**
         const isCR = await CrEmail.findOne({ email: email });

         // 🔥 **Explicitly Assign Role (Override Default)**
         const role = isCR ? "cr" : "student";

        // Create new user with Cloudinary profile photo URL
        const newUser = new User({ agno, email, username, password: hashedPassword, profilePhoto, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", role, profilePhoto });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = SignupController;
