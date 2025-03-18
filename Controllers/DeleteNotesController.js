const Notes = require("../Models/NoteUploadSchema");

const DeleteNotesController = async (req, res) => {
    try {
        const { title } = req.query; // Extract title from query parameters

        if (!title) {
            return res.status(400).json({ message: "Title query parameter is required" });
        }

        const deletedNote = await Notes.findOneAndDelete({ title: { $regex: `^${title}$`, $options: "i" } });

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note deleted successfully", deletedNote });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Server error while deleting note" });
    }
};

module.exports = DeleteNotesController;
