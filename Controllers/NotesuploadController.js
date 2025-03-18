require("dotenv").config();
const Notes = require("../Models/NoteUploadSchema");
const User = require("../Models/UserSchema"); // Assuming you have a User model to get emails
const cloudinary = require("../config/cloudinaryconfig");
const nodemailer = require("nodemailer");

// Upload Notes (Only CRs can upload)
const uploadNotes = async (req, res) => {
    try {
        // ✅ Ensure only CRs can upload notes
        if (req.user.role !== "cr") {
            return res.status(403).json({ message: "Only CRs can upload notes" });
        }

        const { title, youtubeLink } = req.body;
        let fileUrl = ""; // Default empty file URL

        // ✅ If a file is uploaded, upload it to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "uploads",
                resource_type: "auto" // Supports PDFs, DOCX, etc.
            });
            fileUrl = result.secure_url; // Get Cloudinary URL
        }

        // ✅ Save Note in Database
        const newNote = new Notes({
            title,
            fileUrl,
            youtubeLink,
            uploadedBy: req.user.userId
        });

        await newNote.save();

        // ✅ Fetch all users' emails
        const users = await User.find({}, "email");
        const recipientEmails = users.map(user => user.email); // Extract email list

        // ✅ Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your app password
            }
        });

        // ✅ Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmails,
            subject: `📚 New Notes Uploaded: ${title}`,
            html: `
                <h3>New Notes Available: ${title}</h3>
                <p>A new set of notes has been uploaded by your CR. You can download it below:</p>
                <p><strong>Download Link:</strong> <a href="${fileUrl}">${fileUrl}</a></p>
                ${youtubeLink ? `<p><strong>Related Video:</strong> <a href="${youtubeLink}">${youtubeLink}</a></p>` : ""}
                <p>Happy Learning! 🎓</p>
            `
        };

        // ✅ Send the email
        await transporter.sendMail(mailOptions);

        // ✅ Response back to CR
        res.status(201).json({ message: "Notes uploaded & email notifications sent successfully!", fileUrl });
    } catch (error) {
        console.error("❌ Error in Uploading Notes:", error);
        res.status(500).json({ message: "Error uploading notes & sending email", error });
    }
};

module.exports = { uploadNotes };
