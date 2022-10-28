const express = require("express");

// JSON data import
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const { getAllBooks, getSingleBookById, getAllIssuedBooks, addNewBook, updateBookById, getSingleBookByName, issuedBooksWithFine } = require("../controllers/book-controller");

const router = express.Router();

/**
 * Route : /books
 * method : GET
 * Description : Get all books
 * Access : Public
 * Parameters : None
 */
router.get("/", getAllBooks);

/**
 * Route : /books/:id
 * method : GET
 * Description : Get book by id
 * Access : Public
 * Parameters : id
 */
router.get("/:id", getSingleBookById);

router.get("/getbook/name/:name", getSingleBookByName);

/**
 * Route : /books/issued/by-user
 * method : GET
 * Description : Get all issues books
 * Access : Public
 * Parameters : none
 */
router.get("/issued/by-user", getAllIssuedBooks);

/**
 * Route : /books
 * method : POST
 * Description : Create new book
 * Access : Public
 * Parameters : none
 * Data : author, name, genre, price, publisher, id
 */
router.post("/", addNewBook);

/**
 * Route : /books/:id
 * method : PUT
 * Description : Update book
 * Access : Public
 * Parameters : id
 * Data : author, name, genre, price, publisher, id
 */
router.put("/:id", updateBookById);

/**
 * Route : /books/issued/withFine
 * method : GET
 * Description : Get all books with fine
 * Access : Public
 * Parameters : id
 * Data : book, user, fine
 */
router.get("/issued/withFine", issuedBooksWithFine);

//default export
module.exports = router;