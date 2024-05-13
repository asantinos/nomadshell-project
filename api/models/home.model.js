const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 32,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        price: {
            type: Number,
            required: true,
        },
        sqrt: {
            type: Number,
            required: true,
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        parking: {
            type: Boolean,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["Apartment", "Farmhouse", "Bungalow", "Cottage"],
        },
        location: {
            type: [Number],
            required: true,
        },
        images: {
            type: Array,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
