const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
} = require("../booking.controller");
const Booking = require("../../models/booking.model");
const User = require("../../models/user.model");
const Home = require("../../models/home.model");

// Create an instance of express and apply middleware
const app = express();
app.use(express.json());
app.use(cookieParser());

// Mock routes for testing
app.get("/api/bookings", getBookings);
app.get("/api/bookings/:id", getBooking);
app.post("/api/bookings", createBooking);
app.put("/api/bookings/:id", updateBooking);
app.delete("/api/bookings/:id", deleteBooking);

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
    await Booking.deleteMany({});
    await User.deleteMany({});
    await Home.deleteMany({});
});

// Close the in-memory database
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Booking Controller", () => {
    describe("getBookings", () => {
        it("should get all bookings", async () => {
            const home = new Home({ title: "Home 1", price: 100 });
            await home.save();
            const user = new User({
                name: "User 1",
                email: "user1@example.com",
                password: "password123",
                nomadPoints: 500,
            });
            await user.save();
            const booking1 = new Booking({
                home: home._id,
                user: user._id,
                totalPrice: 100,
            });
            const booking2 = new Booking({
                home: home._id,
                user: user._id,
                totalPrice: 200,
            });
            await Booking.insertMany([booking1, booking2]);

            const response = await request(app).get("/api/bookings");

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0].totalPrice).toBe(100);
            expect(response.body[1].totalPrice).toBe(200);
        });
    });

    describe("getBooking", () => {
        it("should get a booking by ID", async () => {
            const home = new Home({ title: "Home 1", price: 100 });
            await home.save();
            const user = new User({
                name: "User 1",
                email: "user1@example.com",
                password: "password123",
                nomadPoints: 500,
            });
            await user.save();
            const booking = new Booking({
                home: home._id,
                user: user._id,
                totalPrice: 100,
            });
            await booking.save();

            const response = await request(app).get(
                `/api/bookings/${booking._id}`
            );

            expect(response.status).toBe(200);
            expect(response.body.totalPrice).toBe(100);
        });

        it("should return 404 if booking not found", async () => {
            const response = await request(app).get("/api/bookings/invalidid");

            expect(response.status).toBe(404);
        });
    });

    describe("createBooking", () => {
        it("should create a new booking", async () => {
            const home = new Home({ title: "Home 1", price: 100 });
            await home.save();
            const user = new User({
                name: "User 1",
                email: "user1@example.com",
                password: "password123",
                nomadPoints: 500,
            });
            await user.save();
            const token = jwt.sign({ id: user._id }, "secret", {
                expiresIn: "1h",
            });

            const bookingData = { home: home._id, totalPrice: 100 };
            const response = await request(app)
                .post("/api/bookings")
                .set("Authorization", `Bearer ${token}`)
                .send(bookingData);

            expect(response.status).toBe(201);
            expect(response.body.booking.totalPrice).toBe(100);

            const booking = await Booking.findOne({ totalPrice: 100 });
            expect(booking).toBeTruthy();
            expect(booking.totalPrice).toBe(100);

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.nomadPoints).toBe(400);
        });

        it("should return 400 if not enough nomadPoints", async () => {
            const home = new Home({ title: "Home 1", price: 100 });
            await home.save();
            const user = new User({
                name: "User 1",
                email: "user1@example.com",
                password: "password123",
                nomadPoints: 50,
            });
            await user.save();
            const token = jwt.sign({ id: user._id }, "secret", {
                expiresIn: "1h",
            });

            const bookingData = { home: home._id, totalPrice: 100 };
            const response = await request(app)
                .post("/api/bookings")
                .set("Authorization", `Bearer ${token}`)
                .send(bookingData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Not enough nomadPoints");
        });
    });

    describe("updateBooking", () => {
        it("should update a booking by ID", async () => {
            const home = new Home({ title: "Home 1", price: 100 });
            await home.save();
            const user = new User({
                name: "User 1",
                email: "user1@example.com",
                password: "password123",
                nomadPoints: 500,
            });
            await user.save();
            const booking = new Booking({
                home: home._id,
                user: user._id,
                totalPrice: 100,
            });
            await booking.save();

            const updatedBookingData = { totalPrice: 200 };
            const response = await request(app)
                .put(`/api/bookings/${booking._id}`)
                .send(updatedBookingData);

            expect(response.status).toBe(200);
            expect(response.body.booking.totalPrice).toBe(200);

            const updatedBooking = await Booking.findById(booking._id);
            expect(updatedBooking.totalPrice).toBe(200);
        });

        it("should return 404 if booking not found", async () => {
            const response = await request(app)
                .put("/api/bookings/invalidid")
                .send({ totalPrice: 200 });

            expect(response.status).toBe(404);
        });
    });

    describe("deleteBooking", () => {
        it("should delete a booking by ID", async () => {
            const home = new Home({ title: "Home 1", price: 100 });
            await home.save();
            const user = new User({
                name: "User 1",
                email: "user1@example.com",
                password: "password123",
                nomadPoints: 500,
            });
            await user.save();
            const booking = new Booking({
                home: home._id,
                user: user._id,
                totalPrice: 100,
            });
            await booking.save();

            const response = await request(app).delete(
                `/api/bookings/${booking._id}`
            );

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Booking deleted successfully");

            const deletedBooking = await Booking.findById(booking._id);
            expect(deletedBooking).toBeNull();

            const updatedUser = await User.findById(user._id);
            expect(updatedUser.nomadPoints).toBe(600);
        });

        it("should return 404 if booking not found", async () => {
            const response = await request(app).delete(
                "/api/bookings/invalidid"
            );

            expect(response.status).toBe(404);
        });
    });
});
