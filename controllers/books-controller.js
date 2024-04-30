const Book = require("../model/Book");
// Set the maximum number of listeners to a higher value
require("events").EventEmitter.defaultMaxListeners = 15;

const cloudinary = require("cloudinary").v2;

exports.getAllBooks = async (req, res) => {
  let books;
  try {
    books = await Book.find();
  } catch (error) {
    console.log(error);
  }

  if (!books) {
    return res.status(404).json({ message: "No books found" });
  }
  return res.status(200).json({ books });
};

//checking file type supported or not
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder) {
  const options = { folder };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.addbook = async (req, res) => {
  try {
    const { name, description, author, price, available } = req.body;

    const image = req.files.image;

    if (!name || !description || !author || !price) {
      return res.status(401).json({
        message: "All field is required",
      });
    }

    // uploading to cloudinary

    const supportedTypes = ["jpg", "jpeg", "png"];

    const fileType = image.name.split(".")[1].toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file type not supported",
      });
    }

    const response = await uploadFileToCloudinary(image, "Bookstore");

    const data = await Book.create({
      name,
      description,
      price,
      author,
      available,
      image: response.secure_url,
    });

    res.status(201).json({
      message: "Book added successfully",
      data,
    });
  } catch (error) {
    return res.status(501).json({
      message: "there is some error while adding book",
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const id = req.params.id;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(401).json({
        message: "id is  invalid",
        book,
      });
    }

    return res.status(201).json({
      message: "get the book",
      book,
    });
  } catch (error) {
    return res.status(501).json({
      message: "there is something wrong",
    });
  }
};

exports.updateBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, available, author, description, price } = req.body;

    const image = req.files.image;
    console.log(id);

    const data = await Book.findById(id);
    console.log(data);

    // uploading to cloudinary

    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = image.name.split(".")[1].toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "file type not supported",
      });
    }

    const response = await uploadFileToCloudinary(image, "Bookstore");

    await Book.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        author,
        available,
        image: response.secure_url,
      },
      { new: true }
    );

    // await Book.findByIdAndUpdate(
    //   id,
    //   {
    //     name,
    //     description,
    //     price,
    //     author,
    //     available,
    //     image: response.secure_url,
    //   },
    //   { new: true }
    // );

    return res.status(201).json({
      message: "book is updated successfully",
    });
  } catch (error) {
    return res.status(501).json({
      message: "there is something error",
    });
  }
};

exports.deleteBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    return res.status(201).json({
      message: "book deleted successfully",
      deletedBook,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Something went wrong",
    });
  }
};
