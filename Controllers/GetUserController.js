const UserSchema = require("../Models/UserSchema")

const GetUserController = async (req, res) => {
    try {
        const users = await UserSchema.find({}, "-password"); // Exclude passwords from the response

        if (!users.length) {
            return res.status(404).json({ message: "No users found!" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = GetUserController;