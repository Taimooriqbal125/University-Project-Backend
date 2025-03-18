const User = require("../Models/UserSchema");
const cloudinary = require("../config/cloudinaryconfig"); // Cloudinary setup

const UpdateProfileController = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from auth middleware

        if (!req.file) {
            return res.status(400).json({ message: "Please upload a profile photo" });
        }

        // ✅ Step 1: Get the current user's profile to find the old image
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Step 2: Delete the old profile photo from Cloudinary (if exists)
        if (user.profilePhoto) {
            // Extract public_id from Cloudinary URL
            const publicId = user.profilePhoto.split("/").pop().split(".")[0]; // Extracting ID from URL
            await cloudinary.uploader.destroy(publicId); // Delete from Cloudinary
        }

        // ✅ Step 3: Upload the new profile photo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Uploads",
            resource_type: "auto"
        });

        // ✅ Step 4: Update user's profile photo in the database with the new URL
        user.profilePhoto = result.secure_url;
        await user.save();

        res.status(200).json({ message: "Profile photo updated successfully", profilePhoto: user.profilePhoto });
    } catch (error) {
        console.error("Error updating profile photo:", error);
        res.status(500).json({ message: "Server error while updating profile photo" });
    }
};

module.exports = UpdateProfileController;
