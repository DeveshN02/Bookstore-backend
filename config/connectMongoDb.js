const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDb = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("db connected"))
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongoDb;
