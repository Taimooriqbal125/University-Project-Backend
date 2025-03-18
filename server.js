require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require('multer');
const connectDB = require("./config/db");
const Routes = require("./Routes/Routes")
// const errorHandler = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();
const app = express();

// ✅ Apply Basic Middleware First
app.use(express.json());  // Parse JSON data
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data
app.use(cors());  // Enable CORS); 

app.use("/", Routes);




// Parse URL-encoded data


// // Global Error Handler
// app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
