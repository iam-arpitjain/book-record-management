const express = require("express");

// JSON data import
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route : /books
 * method : GET
 * Description : Get all books
 * Access : Public
 * Parameters : None
 */
router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    });
});

/**
 * Route : /books/:id
 * method : GET
 * Description : Get book by id
 * Access : Public
 * Parameters : id
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: book
    });
});

/**
 * Route : /books/issued/by-user
 * method : GET
 * Description : Get all issues books
 * Access : Public
 * Parameters : none
 */
router.get("/issued/by-user", (req, res) => {

    const usersWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });



    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No books issued yet"
        });
    }

    return res.status(200).json({
        success: true,
        data: issuedBooks
    });
});

/**
 * Route : /books
 * method : POST
 * Description : Create new book
 * Access : Public
 * Parameters : none
 * Data : author, name, genre, price, publisher, id
 */
router.post("/", (req, res) => {
    const { data } = req.body;

    if (!data) {
        res.status(400).json({
            success: false,
            message: "No Data Provided"
        });
    }

    const book = books.find((each) => each.id === data.id);

    if (book) {
        return res.status(404).json({
            success: false,
            message: "Book already exists with this id, please use a unique id"
        })
    }

    const allBooks = [...books, data];

    return res.status(201).json({
        success: true,
        data: allBooks
    });
});

/**
 * Route : /books/:id
 * method : PUT
 * Description : Update book
 * Access : Public
 * Parameters : id
 * Data : author, name, genre, price, publisher, id
 */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book with this perticular id not found"
        });
    }

    const updateData = books.map((each) => {
        if (each.id === id) {
            return { ...each, ...data };
        }
        return each;
    });

    return res.status(200).json({
        success: true,
        data: updateData
    });
});

/**
 * Route : /books/issued/withFine
 * method : GET
 * Description : Get all books with fine
 * Access : Public
 * Parameters : id
 * Data : book, user, fine
 */
router.get("/issued/withFine", (req, res) => {


    const usersWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;
        issuedBooks.push(book);
    });

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No books are issued"
        });
    };

    const booksWithFine = issuedBooks.map((eachBook) => {
        const user = usersWithIssuedBooks.find((everyUser) => everyUser.issuedBook === eachBook.id);

        const getDateInDays = (data = "") => {
            let date;
            if (data === "") {
                // Current date
                date = new Date();
            } else {
                // getting date on the basis of data variable
                date = new Date(data);
            }
            let days = Math.floor(date / (1000 * 60 * 60 * 24)); //1000 from milliseconds
            return days;
        };

        const getSubscriptionType = (date) => {
            if (user.subscriptionType === "Basic") {
                date = date + 90;
            } else if (user.subscriptionType === "Standard") {
                date = date + 180;
            } else if (user.subscriptionType === "Premium") {
                date = date + 365;
            }
            return date;
        };

        // Subscription expiration calculation
        // January 1, 1970 UTC is the 1st day // milliseconds

        let returnDateInDays = getDateInDays(user.returnDate);
        let currentDateInDays = getDateInDays();
        let subscriptionDateInDays = getDateInDays(user.subscriptionDate);
        let subscriptionExpiration = getSubscriptionType(subscriptionDateInDays);

        const fine = returnDateInDays < currentDateInDays ?
            (subscriptionExpiration <= currentDateInDays ? 200 : 100)
            : 0;

        return {
            ...eachBook,
            fine
        };

    });

    return res.status(200).json({
        success: true,
        data: booksWithFine
    });
});

//default export
module.exports = router;