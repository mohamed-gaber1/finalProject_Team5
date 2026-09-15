const express = require("express");

const {
  getProfile,
  updateProfile
} = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  getProfile
);

router.patch(
  "/me",
  authMiddleware,
  updateProfile
);

module.exports = router;