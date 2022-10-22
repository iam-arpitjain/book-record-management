const express = require("express");

//JSON data import 
const { users } = require("./data/users.json");

const exp = express();

const port = 8081;

exp.use(express.json());

exp.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
});

/**
 * Route : /users
 * method : GET
 * Description : Get all users
 * Access : Public
 * Parameters : None
 */
exp.get("/users", (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    });
});

/**
 * Route : /users/:id
 * method : GET
 * Description : Get single user by id
 * Access : Public
 * Parameters : id
 */
exp.get("/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * Route : /users
 * method : POST
 * Description : Create new user
 * Access : Public
 * Parameters : none
 */
exp.post("/users", (req, res) => {
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

    const user = users.find((each) => each.id === id);

    if (user) {
        return res.status(404).json({
            success: false,
            message: "User exists with this id"
        });
    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
    });

    return res.status(201).json({
        success: true,
        data: users
    })
});

/**
 * Route : /users/:id
 * method : PUT
 * Description : Updating user data
 * Access : Public
 * Parameters : id
 */
exp.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const updatedUser = users.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data
            };
        }

        return each;
    });

    return res.status(200).json({
        success: true,
        data: updatedUser
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