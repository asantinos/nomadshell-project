/**
 * Express server setup and configuration.
 * @module server
 */

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db.js");

const userRouter = require("./routes/user.route.js");
const homeRouter = require("./routes/home.route.js");
const authRouter = require("./routes/auth.route.js");
const bookingRouter = require("./routes/booking.route.js");
const availableDateRouter = require("./routes/availableDate.route.js");
const subscriptionRouter = require("./routes/subscription.route.js");

// Connect to MongoDB
connectDB();

// ! Uncomment before deploying to AWS
// const __dirname = path.resolve();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/users", userRouter);
app.use("/api/homes", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/availableDates", availableDateRouter);
app.use("/api/subscriptions", subscriptionRouter);

/**
 * Health Check endpoint.
 * @name GET/health
 * @function
 * @memberof module:server
 * @inner
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
app.get("/health", (req, res) => {
    res.send("OK");
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // Handle all other routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
    });
}

/**
 * Global error handling middleware.
 * @function
 * @memberof module:server
 * @param {Error} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

/**
 * Start the server.
 * @function
 * @memberof module:server
 * @param {number} port - The port number for the server.
 * @param {function} callback - The callback function.
 */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
