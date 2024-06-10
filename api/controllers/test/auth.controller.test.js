const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { signUp, signIn, google, signOut } = require("../auth.controller");
const User = require("../../models/user.model");

// Create an instance of express and apply middleware
const app = express();
app.use(express.json());
app.use(cookieParser());

// Mock routes for testing
app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/google", google);
app.post("/signout", signOut);

// Set up the in-memory MongoDB database
let mongoServer;

// Connect to the in-memory database
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

// Clear the database and remove the data
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Auth Controller", () => {
    // Sign up test
    describe("signUp", () => {
        it("should create a new user", async () => {
            const response = await request(app).post("/signup").send({
                name: "John",
                surname: "Doe",
                email: "john.doe@example.com",
                password: "password123",
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("User created successfully");

            const user = await User.findOne({ email: "john.doe@example.com" });
            expect(user).toBeTruthy();
            expect(await bcrypt.compare("password123", user.password)).toBe(
                true
            );
        });

        it("should return 400 if user already exists", async () => {
            const user = new User({
                name: "Jane",
                surname: "Doe",
                email: "jane.doe@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            await user.save();

            const response = await request(app).post("/signup").send({
                name: "Jane",
                surname: "Doe",
                email: "jane.doe@example.com",
                password: "password123",
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User already exists");
        });
    });

    // Sign in test
    describe("signIn", () => {
        it("should sign in an existing user", async () => {
            const user = new User({
                name: "Alice",
                surname: "Smith",
                email: "alice.smith@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            await user.save();

            const response = await request(app).post("/signin").send({
                email: "alice.smith@example.com",
                password: "password123",
            });

            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe("alice.smith@example.com");
            expect(response.headers["set-cookie"]).toBeDefined();
        });

        it("should return 400 if user not found", async () => {
            const response = await request(app).post("/signin").send({
                email: "unknown@example.com",
                password: "password123",
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User not found");
        });

        it("should return 400 if password is invalid", async () => {
            const user = new User({
                name: "Bob",
                surname: "Jones",
                email: "bob.jones@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            await user.save();

            const response = await request(app).post("/signin").send({
                email: "bob.jones@example.com",
                password: "wrongpassword",
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid password");
        });
    });

    // Google sign in test
    describe("google", () => {
        it("should sign in an existing Google user", async () => {
            const user = new User({
                name: "Charlie",
                surname: "Brown",
                email: "charlie.brown@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            await user.save();

            const response = await request(app).post("/google").send({
                email: "charlie.brown@example.com",
            });

            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe("charlie.brown@example.com");
            expect(response.headers["set-cookie"]).toBeDefined();
        });

        it("should sign up a new Google user", async () => {
            const response = await request(app).post("/google").send({
                avatar: "avatar-url",
                name: "Dana",
                surname: "Scully",
                email: "dana.scully@example.com",
            });

            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe("dana.scully@example.com");
            expect(response.headers["set-cookie"]).toBeDefined();

            const user = await User.findOne({
                email: "dana.scully@example.com",
            });
            expect(user).toBeTruthy();
            expect(user.name).toBe("Dana");
            expect(user.surname).toBe("Scully");
        });
    });

    // Sign out test
    describe("signOut", () => {
        it("should sign out a user", async () => {
            const response = await request(app).post("/signout");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Sign out successfully");
        });
    });
});
