const express = require("express");
const { uploadNotes } = require("../Controllers/NotesuploadController");
const upload = require("../config/mutlerconfig"); // Multer for file handling
const protect = require("../Middlewares/authMiddleware"); // Protect route
const SignupController = require("../Controllers/SignupController");
const { SigninController } = require("../Controllers/SigninController");
const UserDeleteController = require("../Controllers/UserDeleteController");
const GetUserController = require("../Controllers/GetUserController");
const GetNotesController = require("../Controllers/GetNotesController");
const DeleteNotesController = require("../Controllers/DeleteNotesController");
const UpdateProfileController = require("../Controllers/UpdateProfileController");
const PasswordController = require("../Controllers/PasswordController");
const jsonmiddleware = require("../Middlewares/expressjson");

const router = express.Router();

// Notes Upload - Only CRs can upload
router.post("/signup", (req, res, next) => {
    upload.single("profilePhoto")(req, res, function (err) {  // ✅ Handle only file upload
        if (err) {
            console.error("❌ Multer Error:", err);
            return res.status(400).json({ message: err.message });
        }
        console.log("✅ Multer Passed, Calling Controller...");
        SignupController(req, res);
    });
});

router.post("/signin",SigninController);
router.post("/uploadnotes",protect,upload.single("fileUrl"),uploadNotes);
router.post("/updatephoto",protect,upload.single("profilePhoto"),UpdateProfileController);
router.post("/resetpassword",PasswordController.ResetPassController);
router.post("/forgetpassword",PasswordController.ForgetPassController);
router.delete("/deletestudent",UserDeleteController);
router.delete("/deletenote",DeleteNotesController);
router.get("/viewallstudents",GetUserController);
router.get("/viewnotes",GetNotesController);

module.exports = router;