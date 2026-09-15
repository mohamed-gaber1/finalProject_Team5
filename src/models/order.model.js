const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
                min: 1,
            },

            price: {
                type: Number,
                required: true,
                min: 0,
            },
            },
        ],

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["Pending", "Shipped", "Delivered", "Canceled"],
            default: "Pending",
        },

        shippingAddress: {
            type: String,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["COD"],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);