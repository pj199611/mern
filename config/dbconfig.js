const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Database connected");
  } catch (e) {
    console.log("Database error", e);
  }
};

module.exports = dbConnect;
