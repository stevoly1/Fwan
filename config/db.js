const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => console.log("Connected to the database"))
    .catch((err) => {
      console.error("Database connection error:", err);
      process.exit(1); // Exit the process with failure
    });
};

module.exports = connectDB;
