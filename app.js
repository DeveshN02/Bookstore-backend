const express = require("express");
const app = express();
const connectMongoDb = require("./config/connectMongoDb");
require("dotenv").config();
const router = require("./routes/book-routes");
const cors = require("cors");
const connectCloudinary = require("./config/cloudinary");

// connecting db
connectMongoDb();

// connecting cloudinary
connectCloudinary().then(console.log("cloudinary connected"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const fileupload = require("express-fileupload");
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// mounting route
app.use("/books", router);

// starting app
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(" server started at", PORT);
});
