const express = require("express");
const dotenv = require("dotenv");
//database connection
const DbConnection = require("./databaseConnection");

// importing routes
const usersRouter = require("./routes/users"); // this initially takes file in js 
const booksRouter = require("./routes/books");// so we don't need to mention .js

dotenv.config();

const exp = express();

DbConnection();

const port = 8081;

exp.use(express.json());

exp.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
});

exp.use("/users", usersRouter);
exp.use("/books", booksRouter);

exp.get("*", (req, res) => {
    res.status(404).json({
        message: "This route does not exist"
    });
});

exp.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});