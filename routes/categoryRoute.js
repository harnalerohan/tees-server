const express = require("express");
const router = express.Router();

const {
  getCategoryById, 
  createCategory, 
  getCategory, 
  getAllCategories, 
  updateCategory, 
  removeCategory
} = require("../controllers/categoryCont")

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/authCont")
const {getUserById} = require("../controllers/userCont")

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//actual routes are gonna go here

//Create - create category
router.post("/category/create/:userId",
  isSignedIn, 
  isAuthenticated, 
  isAdmin, 
  createCategory
);

//Read - get single category by id
router.get("/category/:categoryId", getCategory)

//Read - get All categories
router.get("/categories", getAllCategories)

//Update - update category by id
router.put("/category/:categoryId/:userId", 
  isSignedIn,
  isAuthenticated,
  isAdmin, 
  updateCategory
);

//DELETE - delete single category by id;
router.delete("/category/:categoryId/:userId", 
  isSignedIn,
  isAuthenticated,
  isAdmin, 
  removeCategory
);

module.exports = router

