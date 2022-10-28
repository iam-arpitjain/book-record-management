const { BookModel, UserModel } = require('../models');
const IssuedBook = require("../dtos/book-dto");

exports.getAllBooks = async (req, res) => {
    const books = await BookModel.find();

    if (books.length === 0) return res.status(404).json({
        success: false, message: "No book found"
    });

    return res.status(200).json({
        success: true, data: books
    });
};

exports.getSingleBookById = async (req, res) => {
    const { id } = req.params;

    const book = await BookModel.findById(id);

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
};

//Additional route 
exports.getSingleBookByName = async (req, res) => {
    const { name } = req.params;

    const book = await BookModel.findOne({
        name: name,
    });

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
};

exports.getAllIssuedBooks = async (req, res) => {
    const users = await UserModel.find({
        issuedBook: { $exists: true },
    }).populate("issuedBook");

    const issuedBooks = users.map((each) => new IssuedBook(each));

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
}

exports.addNewBook = async (req, res) => {
    const { data } = req.body;

    if (!data) {
        res.status(400).json({
            success: false,
            message: "No Data Provided"
        });
    }

    await BookModel.create(data);

    const allBooks = await BookModel.find();

    return res.status(201).json({
        success: true,
        data: allBooks
    });
}

exports.updateBookById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const updateBook = await BookModel.findOneAndUpdate({
        _id: id,
    },
        data,
        { new: true });

    return res.status(200).json({
        success: true,
        data: updateBook
    });
}

exports.issuedBooksWithFine = async (req, res) => {

    const usersWithIssuedBooks = await UserModel.find({
        issuedBook: { $exists: true },
    }).populate("issuedBook");

    const issuedBooks = usersWithIssuedBooks.map((each) => new IssuedBook(each));

    // console.log(usersWithIssuedBooks, issuedBooks);

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No books are issued"
        });
    };

    const booksWithFine = issuedBooks.map((eachBook) => {
        const user = usersWithIssuedBooks.find((everyUser) => everyUser.issuedBook._id === eachBook._id);

        // console.log(user);

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
}