const express = require("express");

const exp = express();

const port = 8081;

exp.use(express.json());

exp.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
});

exp.get("*", (req, res) => {
    res.status(404).json({
        message: "This route does not exist"
    });
});

exp.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});