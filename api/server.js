const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");
const userRouter = require("./routes/user.route.js");
const homeRouter = require("./routes/home.route.js");
const authRouter = require("./routes/auth.route.js");

// DB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((err) => {
        console.log(err);
    });

// const __dirname = path.resolve(); // path.resolve() returns the absolute path of the current working directory

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/homes", homeRouter);
app.use("/api/auth", authRouter);

// Health Check
app.get("/health", (req, res) => {
    res.send("OK");
});

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
