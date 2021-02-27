const express = require("express");
const router = express.Router();
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/authCont")
const {getUserById, PushOrderInPurchaseList} = require("../controllers/userCont")
const {updateStock} = require("../controllers/productCont")

const {getOrderById, createOrder, getAllOrders, getUserOrder, getOrderStatus, updateStatus, cancelOrder} = require("../controllers/orderCont")

// params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual routes

// CREATE - create new order
router.post("/order/create/:userId", isSignedIn, isAuthenticated, PushOrderInPurchaseList, updateStock, createOrder)

//READ - fetch all orders.
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)

//DELETE - Cancels the order
router.delete("/order/all/delete/:orderId/:userId", isSignedIn, isAuthenticated, isAdmin, cancelOrder)

//routes for status of order

//READ - check order status
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus)

//UPDATE - update order status
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus)



module.exports = router
