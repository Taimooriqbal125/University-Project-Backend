const NoteUploadSchema = require("../Models/NoteUploadSchema");

const getNotes = async (req, res) => {
    try {
        const { title } = req.query;

        
        let query = {};
        if (title) {
            let formattedTitle = title.replace(/[-\s]*(\d+)/g, "[-\\s]*$1"); 
            query.title = { $regex: formattedTitle, $options: "i" }; // ✅ Case-insensitive search
        }   
        
        

        const notes = await NoteUploadSchema.find(query);

        if (notes.length === 0) {
            return res.status(404).json({ message: "No notes found" });
        }

        // ✅ Add direct download link (assuming fileUrl is stored in DB)
        const notesWithDownloadLinks = notes.map(note => ({
            ...note._doc,
            downloadLink: `${note.fileUrl}?download=true`
        }));

        res.status(200).json(notesWithDownloadLinks);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Server error while fetching notes" });
    }
};

module.exports = getNotes