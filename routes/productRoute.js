const express = require("express");
const router = express.Router();

const {
  getProductById, 
  createProduct, 
  getProduct, 
  photo, 
  deleteProduct, 
  updateProduct, 
  getAllProducts,
  getAllUniqueCategories
} = require("../controllers/productCont");

const {
  isSignedIn, 
  isAuthenticated, 
  isAdmin
} = require("../controllers/authCont")

const {getUserById} = require("../controllers/userCont")

//READ - All params to fecth id of user and products resp.
router.param("userId", getUserById);
router.param("productId", getProductById);

//Actual routes

// 603381a3be7de340fcd782be

//CREATE - create a product
router.post("/product/create/:userId", 
  isSignedIn, 
  isAuthenticated, 
  isAdmin, 
  createProduct
)

//READ - get a single product based on id
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo)

//UPDATE
router.put("/product/:productId/:userId",
  isSignedIn, 
  isAuthenticated, 
  isAdmin, 
  updateProduct
)

//DELETE
router.delete("/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
)

//READ - Listing routes - (get all products just like get all users) - (this route will show all products just like when we go to main page of amazon.in all products are shown. We have to limit how many products we want to show on the page)
router.get("/products", getAllProducts)

//READ - while admin uploading product, he has to choose category, it will be populated and cant be created by admin
router.get("products/categories", getAllUniqueCategories);

module.exports = router
