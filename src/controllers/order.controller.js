const Order = require("../models/order.model");
const Product = require("../models/productModel");
const User = require("../models/user.model");

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            items,
            shippingAddress,
            paymentMethod
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order items are required"
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                message: "Payment method is required"
            });
        }

        if (paymentMethod !== "COD") {
            return res.status(400).json({
                message: "Only Cash on Delivery is available"
            });
        }

        const orderItems = [];
        let total = 0;

        for (const item of items) {

            if (!item.productId || !item.quantity) {
                return res.status(400).json({
                    message: "Product ID and quantity are required"
                });
            }

            if (item.quantity < 1) {
                return res.status(400).json({
                    message: "Quantity must be at least 1"
                });
            }

            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.productId}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for product: ${product.name}`
                });
            }

            const itemTotal = product.price * item.quantity;

            total += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = await Order.create({
            user: userId,
            items: orderItems,
            total,
            status: "Pending",
            shippingAddress,
            paymentMethod
        });

        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        return res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({
            user: userId
        })
            .select("items status total shippingAddress createdAt")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            orders
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: userId
        })
            .populate("items.product", "name price images");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: userId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status !== "Pending") {
            return res.status(400).json({
                message: "Only pending orders can be canceled"
            });
        }

        order.status = "Canceled";

        await order.save();

        return res.status(200).json({
            message: "Order canceled successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            search
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const filter = {};

        if (status) {
            filter.status = status;
        }

        // Search by Order ID
        if (search && search.match(/^[0-9a-fA-F]{24}$/)) {
            filter._id = search;
        }

        // Search by Buyer Name
        if (search && !search.match(/^[0-9a-fA-F]{24}$/)) {
            const User = require("../models/user.model");

            const users = await User.find({
                name: { $regex: search, $options: "i" }
            }).select("_id");

            const userIds = users.map(user => user._id);

            filter.user = { $in: userIds };
        }

        const skip = (pageNumber - 1) * limitNumber;

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        return res.status(200).json({
            page: pageNumber,
            limit: limitNumber,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Shipped",
            "Delivered",
            "Canceled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const currentStatus = order.status;

        if (currentStatus === "Pending") {

            if (status !== "Shipped" && status !== "Canceled") {
                return res.status(400).json({
                    message: "Invalid status transition"
                });
            }
        }

        if (currentStatus === "Shipped") {

            if (status !== "Delivered") {
                return res.status(400).json({
                    message: "Invalid status transition"
                });
            }
        }

        if (currentStatus === "Delivered") {
            return res.status(400).json({
                message: "Delivered order cannot be changed"
            });
        }

        if (currentStatus === "Canceled") {
            return res.status(400).json({
                message: "Canceled order cannot be changed"
            });
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
};