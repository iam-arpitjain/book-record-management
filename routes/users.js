const express = require("express");

// JSON data import
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route : /users
 * method : GET
 * Description : Get all users
 * Access : Public
 * Parameters : None
 */
router.get("/", (req, res) => {
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
router.get("/:id", (req, res) => {
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
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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

/**
 * Route : /users/:id
 * method : DELETE
 * Description : Delete user by id
 * Access : Public
 * Parameters : id
 */
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User to be deleted was not found"
        });
    }

    const index = users.indexOf(user);
    users.splice(index, 1);

    return res.status(200).json({
        success: true,
        data: users
    });
});

/**
 * Route : /users/subscription-datails/:id
 * method : GET
 * Description : Get all user subscription details
 * Access : Public
 * Parameters : id
 * Data : ...user, subscriptionExpired, daysLeftForExpiration, fine
 */
router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No user with this id exists"
        });
    }

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

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDateInDays,
        daysLeftForExpiration: subscriptionExpiration <= currentDateInDays ? 0 : subscriptionExpiration - currentDateInDays,
        fine:
            returnDateInDays < currentDateInDays ?
                (subscriptionExpiration <= currentDateInDays ? 200 : 100)
                : 0,

    }

    return res.status(200).json({
        success: true,
        data
    });
});

module.exports = router;