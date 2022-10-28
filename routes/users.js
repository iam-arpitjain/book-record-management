const express = require("express");
const { getAllUsers, getSingleUserById, deleteUser, updateUserById, createNewUser, getSubscriptionDetailsById } = require("../controllers/user-controller");

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
router.get("/", getAllUsers);

/**
 * Route : /users/:id
 * method : GET
 * Description : Get single user by id
 * Access : Public
 * Parameters : id
 */
router.get("/:id", getSingleUserById);

/**
 * Route : /users
 * method : POST
 * Description : Create new user
 * Access : Public
 * Parameters : none
 */
router.post("/", createNewUser);

/**
 * Route : /users/:id
 * method : PUT
 * Description : Updating user data
 * Access : Public
 * Parameters : id
 */
router.put("/:id", updateUserById);

/**
 * Route : /users/:id
 * method : DELETE
 * Description : Delete user by id
 * Access : Public
 * Parameters : id
 */
router.delete("/:id", deleteUser);

/**
 * Route : /users/subscription-datails/:id
 * method : GET
 * Description : Get all user subscription details
 * Access : Public
 * Parameters : id
 * Data : ...user, subscriptionExpired, daysLeftForExpiration, fine
 */
router.get("/subscription-details/:id", getSubscriptionDetailsById);

module.exports = router;