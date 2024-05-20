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
            validate: {
                validator: function (value) {
                    return this.startDate < value;
                },
                message: "End date must be after the start date",
            },
        },
    },
    {
        timestamps: true,
    }
);

const AvailableDate = mongoose.model("AvailableDate", availableDateSchema);

module.exports = AvailableDate;
