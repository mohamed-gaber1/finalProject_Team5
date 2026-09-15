const express = require("express");

const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

// Buyer
router.post("/", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/:id", authMiddleware, getOrderById);

router.patch("/:id/cancel", authMiddleware, cancelOrder);


// Admin
router.get(
    "/",
    authMiddleware,
    authorize("Admin"),
    getAllOrders
);

router.patch(
    "/:id/status",
    authMiddleware,
    authorize("Admin"),
    updateOrderStatus
);

module.exports = router;