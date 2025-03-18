const mongoose = require("mongoose");

const NotesUploadSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true},
    fileUrl: { type: String, required: true ,unique: true }, // Cloudinary file URL
    youtubeLink: { type: String,required: true ,unique: true},
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to CR user
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notes", NotesUploadSchema);
