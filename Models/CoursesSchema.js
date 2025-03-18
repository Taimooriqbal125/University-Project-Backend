const mongoose = require("mongoose");

const CoursesSchema = new mongoose.Schema({
    name: { type: String, required: true, unique:true},
    professorname:{type: String, required: true, unique:true},
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to CR user
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Courses", CoursesSchema);
