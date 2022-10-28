const { UserModel, BookModel } = require("../models");

exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find();

    if (users.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No users found"
        });
    }

    res.status(200).json({
        success: true,
        data: users
    });
}

exports.getSingleUserById = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById({ _id: id });
    //const user = await UserModel.findById(id)

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
}

exports.createNewUser = async (req, res) => {
    const { data } = req.body;

    const newUser = await UserModel.create(data);

    return res.status(201).json({
        success: true,
        data: newUser
    })
}

exports.updateUserById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const updatedUserData = await UserModel.findOneAndUpdate(
        {
            _id: id
        },
        {
            $set: { ...data } // it can also add field which was not present in the schema
        },
        {
            new: true
        }
    );

    return res.status(200).json({
        success: true,
        data: updatedUserData
    });
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.deleteOne({ _id: id });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User to be deleted was not found"
        });
    }

    return res.status(200).json({
        success: true,
        data: user,
        message: "Deleted the user successfully"
    });
}

exports.getSubscriptionDetailsById = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.findById(id);

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
        ...user, // we can write ...user._doc to get only related information 
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
}
