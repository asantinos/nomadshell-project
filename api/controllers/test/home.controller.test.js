const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
    getHomes,
    getHome,
    createHome,
    updateHome,
    deleteHome,
} = require("../home.controller");
const Home = require("../../models/home.model");
const User = require("../../models/user.model");

// Create an instance of express and apply middleware
const app = express();
app.use(express.json());
app.use(cookieParser());

// Mock routes for testing
app.get("/api/homes", getHomes);
app.get("/api/homes/:id", getHome);
app.post("/api/homes", createHome);
app.put("/api/homes/:id", updateHome);
app.delete("/api/homes/:id", deleteHome);

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
    await Home.deleteMany({});
    await User.deleteMany({});
});

// Close the in-memory database
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Home Controller", () => {
    describe("getHomes", () => {
        it("should get all homes", async () => {
            const home1 = new Home({ title: "Home 1", price: 100 });
            const home2 = new Home({ title: "Home 2", price: 200 });
            await Home.insertMany([home1, home2]);

            const response = await request(app).get("/api/homes");

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0].title).toBe("Home 1");
            expect(response.body[1].title).toBe("Home 2");
        });
    });

    describe("getHome", () => {
        it("should get a home by ID", async () => {
            const home = new Home({ title: "Test Home", price: 150 });
            await home.save();

            const response = await request(app).get(`/api/homes/${home._id}`);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe("Test Home");
            expect(response.body.price).toBe(150);
        });

        it("should return 404 if home not found", async () => {
            const response = await request(app).get("/api/homes/invalidid");

            expect(response.status).toBe(404);
        });
    });

    describe("createHome", () => {
        it("should create a new home", async () => {
            const homeData = { title: "New Home", price: 300 };
            const response = await request(app)
                .post("/api/homes")
                .send(homeData);

            expect(response.status).toBe(201);
            expect(response.body.home.title).toBe("New Home");
            expect(response.body.home.price).toBe(300);

            const home = await Home.findOne({ title: "New Home" });
            expect(home).toBeTruthy();
            expect(home.price).toBe(300);
        });
    });

    describe("updateHome", () => {
        it("should update a home by ID", async () => {
            const user = new User({
                name: "Test User",
                email: "user@example.com",
                password: "password123",
                role: "admin",
            });
            await user.save();
            const token = jwt.sign(
                { id: user._id, role: user.role },
                "secret",
                { expiresIn: "1h" }
            );

            const home = new Home({
                title: "Old Title",
                price: 400,
                owner: user._id,
            });
            await home.save();

            const updatedHomeData = { title: "Updated Title", price: 500 };
            const response = await request(app)
                .put(`/api/homes/${home._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedHomeData);

            expect(response.status).toBe(200);
            expect(response.body.updatedHome.title).toBe("Updated Title");
            expect(response.body.updatedHome.price).toBe(500);

            const updatedHome = await Home.findById(home._id);
            expect(updatedHome.title).toBe("Updated Title");
            expect(updatedHome.price).toBe(500);
        });

        it("should return 404 if home not found", async () => {
            const user = new User({
                name: "Test User",
                email: "user@example.com",
                password: "password123",
                role: "admin",
            });
            await user.save();
            const token = jwt.sign(
                { id: user._id, role: user.role },
                "secret",
                { expiresIn: "1h" }
            );

            const response = await request(app)
                .put("/api/homes/invalidid")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "New Title" });

            expect(response.status).toBe(404);
        });
    });

    describe("deleteHome", () => {
        it("should delete a home by ID", async () => {
            const user = new User({
                name: "Test User",
                email: "user@example.com",
                password: "password123",
                role: "admin",
            });
            await user.save();
            const token = jwt.sign(
                { id: user._id, role: user.role },
                "secret",
                { expiresIn: "1h" }
            );

            const home = new Home({
                title: "Test Home",
                price: 400,
                owner: user._id,
            });
            await home.save();

            const response = await request(app)
                .delete(`/api/homes/${home._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(204);

            const deletedHome = await Home.findById(home._id);
            expect(deletedHome).toBeNull();
        });

        it("should return 404 if home not found", async () => {
            const user = new User({
                name: "Test User",
                email: "user@example.com",
                password: "password123",
                role: "admin",
            });
            await user.save();
            const token = jwt.sign(
                { id: user._id, role: user.role },
                "secret",
                { expiresIn: "1h" }
            );

            const response = await request(app)
                .delete("/api/homes/invalidid")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
