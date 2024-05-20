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

// Connect to MongoDB
connectDB();

// const __dirname = path.resolve(); // path.resolve() returns the absolute path of the current working directory

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/homes", homeRouter);
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/availableDates", availableDateRouter);

// Health Check
app.get("/health", (req, res) => {
    res.send("OK");
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, "/client/dist")));

// Handle all other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

// Error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
