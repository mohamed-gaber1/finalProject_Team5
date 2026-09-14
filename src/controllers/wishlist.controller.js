const Wishlist = require("../models/wishlist.model");

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const userId = req.user.id;

        const existingWishlist = await Wishlist.findOne({
            user: userId,
            product: productId,
        });

        if (existingWishlist) {
            return res.status(400).json({
            message: "Product already exists in wishlist",
            });
        }

        const wishlist = await Wishlist.create({
            user: userId,
            product: productId,
        });

        return res.status(201).json({
            message: "Product added to wishlist",
            wishlist,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const getWishlist = async (req, res) => {
        try {
        const userId = req.user.id;
        const wishlist = await Wishlist.find({ user: userId })
            .populate("product", "name price images");

        return res.status(200).json({
            wishlist
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const wishlist = await Wishlist.findOneAndDelete({
            user: userId,
            product: productId,
        });
        if (!wishlist) {
            return res.status(404).json({
            message: "Product not found in wishlist",
            });
        }
        return res.status(200).json({
            message: "Product removed from wishlist",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
    });
    }
};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
};