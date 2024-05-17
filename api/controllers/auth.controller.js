const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign Up
const signUp = async (req, res, next) => {
    try {
        const { name, surname, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            surname,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};

// Sign In
const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        // Return user without password
        const { password: userPassword, ...userWithoutPassword } = user._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
        })
            .status(200)
            .json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

// Google OAuth
const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            // Sign in
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET
            );

            // Return user without password
            const { password: userPassword, ...userWithoutPassword } =
                user._doc;

            res.cookie("access_token", token, {
                httpOnly: true,
            })
                .status(200)
                .json({ user: userWithoutPassword });
        } else {
            // Sign up
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            const newUser = new User({
                avatar: req.body.avatar,
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: hashedPassword,
            });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

            // Return user without password
            const { password: userPassword, ...userWithoutPassword } =
                newUser._doc;

            res.cookie("access_token", token, {
                httpOnly: true,
            })
                .status(200)
                .json({ user: userWithoutPassword });
        }
    } catch (error) {
        next(error);
    }
};

// Sign Out
const signOut = (req, res) => {
    try {
        res.clearCookie("access_token")
            .status(200)
            .json({ message: "Sign out successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { signUp, signIn, google, signOut };
