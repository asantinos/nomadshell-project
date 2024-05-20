const mongoose = require("mongoose");

const availableDateSchema = new mongoose.Schema(
    {
        home: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Home",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const AvailableDate = mongoose.model("AvailableDate", availableDateSchema);

module.exports = AvailableDate;
