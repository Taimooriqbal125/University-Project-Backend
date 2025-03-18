const UserSchema = require("../Models/UserSchema");

const UserDeleteController = async (req, res) => {
    try {
        const { agno } = req.body; // Extract AGNO from request body

        if (!agno) {
            return res.status(400).json({ message: "AG-NO is required!" });
        }

        // Find user by AGNO
        const user = await UserSchema.findOne({ agno });

        if (!user) {
            return res.status(404).json({ message: "AG-NO not found!" });
        }

        // Delete user by AGNO
        await UserSchema.deleteOne({ agno });

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = UserDeleteController;
