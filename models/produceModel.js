




const produceSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farmer',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        quantity: {
            amount: { type: Number, required: true, min: 0 },
            unit: { type: [String], enum: ["kg","basket","bags"], default: "kg" },
        },
        images: [String], // array of image URLs or paths
        askingPrice: {
            // optional minimal acceptable price
            type: Number,
            min: 0,
        },
        location: {
            // listing-specific location override
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending","active", "sold", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

produceSchema.index({ "quantity.amount": 1 });

module.exports = mongoose.model("Produce", produceSchema);
