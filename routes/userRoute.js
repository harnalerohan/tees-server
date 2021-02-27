const { Router } = require("express");
const express = require("express");
const router = express.Router();

const { getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/userCont")
const { isSignedIn, isAuthenticated } = require("../controllers/authCont")

//Id fetching param
router.param("userId", getUserById);

//Read - this one helps user to see his profile, he must be authenticated before doing so.
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//Update - this one helps user to update his profile, he must be authenticated before doing so.
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

//Read - this one helps user to see all his orders.
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router


