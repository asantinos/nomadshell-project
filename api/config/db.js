/**
 * Configuration and connection to MongoDB database.
 * @module db
 */

const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database.
 * @async
 * @function connectDB
 * @param {string} process.env.MONGO_URI - URI for connecting to the MongoDB database.
 * @throws {Error} Error if the connection to the database fails.
 */
const connectDB = async () => {
    try {
        await mongoose
            .connect(process.env.MONGO_URI)
            .then(() => console.log("Connected to MongoDB!"));
    } catch (err) {
        console.error(err);
        throw new Error("Failed to connect to MongoDB.");
    }
};

module.exports = connectDB;
