const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const {
    getAvailableDates,
    createAvailableDate,
    deleteAvailableDate,
} = require("../availableDate.controller");
const AvailableDate = require("../../models/availableDate.model");

// Create an instance of express and apply middleware
const app = express();
app.use(express.json());

// Mock routes for testing
app.get("/available-dates", getAvailableDates);
app.post("/available-dates", createAvailableDate);
app.delete("/available-dates/:id", deleteAvailableDate);

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

jest.setTimeout(30000); // 30 seconds

describe("AvailableDate Controller", () => {
    describe("getAvailableDates", () => {
        it("should retrieve all available dates", async () => {
            const response = await request(app).get("/available-dates");
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe("createAvailableDate", () => {
        it("should create a new available date with endDate after startDate", async () => {
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1); // Set endDate to be 1 day after startDate

            const newAvailableDate = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                home: "Home Name",
            };

            const response = await request(app)
                .post("/available-dates")
                .send(newAvailableDate);
            expect(response.status).toBe(200);
            expect(response.body.startDate).toEqual(newAvailableDate.startDate);
            expect(response.body.endDate).toEqual(newAvailableDate.endDate);
            expect(response.body.home).toBe(newAvailableDate.home);
        });

        it("should return 400 if endDate is before startDate", async () => {
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() - 1); // Set endDate to be 1 day before startDate

            const newAvailableDate = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                home: "Home Name",
            };

            const response = await request(app)
                .post("/available-dates")
                .send(newAvailableDate);
            expect(response.status).toBe(400);
        });
    });

    describe("deleteAvailableDate", () => {
        it("should delete an available date", async () => {
            const newAvailableDate = new AvailableDate({
                startDate: new Date(),
                endDate: new Date(),
                home: "Home Name",
            });
            await newAvailableDate.save();

            const response = await request(app).delete(
                `/available-dates/${newAvailableDate._id}`
            );
            expect(response.status).toBe(200);
            expect(response.body.message).toBe(
                "Available date deleted successfully"
            );
        });
    });
});
