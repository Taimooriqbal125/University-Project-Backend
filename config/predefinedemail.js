require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db"); // Use existing DB connection setup
const CrEmail = require("../Models/CrSchema");

// Function to insert predefined CR emails
const addCrEmails = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        console.log("✅ Connected to MongoDB");

        // Define CR emails
        const crEmails = [
            { email: "taimooriqbal308@gmail.com" },
            { email: "taimooriqbal308@gmail.com" }
        ];

        // Insert CR emails if they don't already exist
        for (let cr of crEmails) {
            const exists = await CrEmail.findOne({ email: cr.email });
            if (!exists) {
                await CrEmail.create(cr);
                console.log(`✅ Added CR Email: ${cr.email}`);
            } else {
                console.log(`⚠️ CR Email Already Exists: ${cr.email}`);
            }
        }

        console.log("✅ Predefined CR emails setup completed!");
        mongoose.connection.close(); // Close connection after execution
    } catch (error) {
        console.error("❌ Error adding CR emails:", error);
        mongoose.connection.close();
    }
};

// Execute script
addCrEmails();
