const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

// Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin only
router.post("/", authMiddleware, authorize("admin"), createProduct);
router.put("/:id", authMiddleware, authorize("admin"), updateProduct);
router.delete("/:id", authMiddleware, authorize("admin"), deleteProduct);

module.exports = router;