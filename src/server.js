const app = require("./app");
require("dotenv").config();
const connectDB = require("./config/db");

connectDB();


if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
