const express = require("express");
const router = express.Router();

const {isSignedIn, isAuthenticated} = require("../controllers/authCont")

const {getToken,processPayment } = require("../controllers/paymentCont")
const {getUserById} = require("../controllers/userCont")


router.param("userId", getUserById);

router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken)

router.post("/payment/braintree/:userId", isSignedIn, isAuthenticated, processPayment)

module.exports = router

