const express = require("express");
const router = express.Router();

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    moveToCart,
} = require("../controllers/wishlist.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// Move to cart
router.post("/:productId/move-to-cart", authMiddleware, moveToCart);

// Add to wishlist
router.post("/:productId", authMiddleware, addToWishlist);

// Get wishlist
router.get("/", authMiddleware, getWishlist);

// Remove from wishlist
router.delete("/:productId", authMiddleware, removeFromWishlist);

module.exports = router;