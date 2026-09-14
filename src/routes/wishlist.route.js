const express = require("express");
const router = express.Router();

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} = require("../controllers/wishlist.controller");

router.post("/:productId", addToWishlist);
router.get("/", getWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;