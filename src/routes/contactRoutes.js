const express = require("express");

const router = express.Router();

const {
  createContactMessage,
  getContactMessages
} = require("../controllers/contactController");

const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");

// Public
router.post("/", createContactMessage);

// Admin only
router.get("/", authMiddleware, authorize("Admin"), getContactMessages);

module.exports = router;