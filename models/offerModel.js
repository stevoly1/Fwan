const mongoose = require("mongoose");




const offerSchema = new mongoose.Schema(
    {
        produce: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Produce",
            required: true,
            index: true,
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Buyer",
            required: true,
            index: true,
        },
        offeredPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        quantityRequested: {
            type: Number,
            required: true,
            min: 0,
        },
        message: {
            type: String,
            maxlength: 500,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

offerSchema.index({ status: 1 });

module.exports = mongoose.model("Offer", offerSchema);
