const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require("../user.controller");
const User = require("../../models/user.model");

// Create an instance of express and apply middleware
const app = express();
app.use(express.json());
app.use(cookieParser());

// Mock routes for testing
app.get("/api/users", getUsers);
app.get("/api/users/:id", getUserById);
app.put("/api/users/:id", updateUser);
app.delete("/api/users/:id", deleteUser);

// Set up the in-memory MongoDB database
let mongoServer;

// Connect to the in-memory database
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

// Clear the database and remove the data
afterEach(async () => {
    await User.deleteMany({});
});

// Close the in-memory database
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("User Controller", () => {
    describe("getUsers", () => {
        it("should get all users", async () => {
            const user1 = new User({
                name: "User 1",
                email: "user1@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            const user2 = new User({
                name: "User 2",
                email: "user2@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            await User.insertMany([user1, user2]);

            const response = await request(app).get("/api/users");

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0].name).toBe("User 1");
            expect(response.body[1].name).toBe("User 2");
        });
    });

    describe("getUserById", () => {
        it("should get a user by ID", async () => {
            const user = new User({
                name: "Test User",
                email: "testuser@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            await user.save();

            const response = await request(app).get(`/api/users/${user._id}`);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe("Test User");
            expect(response.body.email).toBe("testuser@example.com");
        });

        it("should return 404 if user not found", async () => {
            const response = await request(app).get("/api/users/invalidid");

            expect(response.status).toBe(404);
        });
    });

    describe("updateUser", () => {
        it("should update a user by ID", async () => {
            const user = new User({
                name: "Old Name",
                email: "oldemail@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            await user.save();

            const updatedUserData = {
                name: "New Name",
                email: "newemail@example.com",
            };
            const response = await request(app)
                .put(`/api/users/${user._id}`)
                .send(updatedUserData);

            expect(response.status).toBe(200);
            expect(response.body.user.name).toBe("New Name");
            expect(response.body.user.email).toBe("newemail@example.com");
        });

        it("should return 404 if user not found", async () => {
            const response = await request(app)
                .put("/api/users/invalidid")
                .send({ name: "New Name" });

            expect(response.status).toBe(404);
        });
    });

    describe("deleteUser", () => {
        it("should delete a user by ID", async () => {
            const user = new User({
                name: "Test User",
                email: "testuser@example.com",
                password: await bcrypt.hash("password123", 10),
            });
            await user.save();

            const response = await request(app).delete(
                `/api/users/${user._id}`
            );

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User deleted successfully");
        });

        it("should return 404 if user not found", async () => {
            const response = await request(app).delete("/api/users/invalidid");

            expect(response.status).toBe(404);
        });
    });
});
