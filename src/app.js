const express = require("express");

const app = express();

app.use(express.json());

const wishlistRoutes = require("./routes/wishlist.route");

app.use("/api/wishlist", wishlistRoutes);

module.exports = app;