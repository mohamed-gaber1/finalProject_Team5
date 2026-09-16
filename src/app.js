const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(express.json());

const wishlistRoutes = require("./routes/wishlist.route");
const orderRoutes = require("./routes/order.route");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


module.exports = app;
