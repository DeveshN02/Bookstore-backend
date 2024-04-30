const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  addbook,
  updateBookById,
  deleteBookById,
} = require("../controllers/books-controller");

router.get("/", getAllBooks);
router.post("/addbook", addbook);
router.get("/getbookbyid/:id", getBookById);
router.patch("/updatebook/:id", updateBookById);
router.delete("/deletebook/:id", deleteBookById);

module.exports = router;
