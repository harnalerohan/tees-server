const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');

const {signout, signup, signin, isSignedIn} = require("../controllers/authCont");

//CREATE - This one helps to create a new user
router.post("/signup", [
  check('name')
    .isLength({min: 3})
    .withMessage("Name Must be at least 3 characters long"),
  check('email')
    .isEmail()
    .withMessage("Email is required"),
  check('password')
    .isLength({min : 3})
    .withMessage("Password should be at least 3 char long"),
  check('contact')
    .isLength({min : 10})
    .withMessage("Contact must be at least 10 digit long")
], signup)

//Read - This one helps user to sign in
router.post("/signin", [
  check('email')
    .isEmail()
    .withMessage("Email is required"),
  check('password')
    .isLength({min : 3})
    .withMessage("Password is required")
], signin);

//READ - This one helps user to sign out (clear cookies from browser using cookie parser)
router.get("/signout", signout);


router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);

  // req.auth will have following structure:
  // { _id: '6027fff2ddc96d31080a9caf', iat: 1613408530 }
  //this id will be used to check if user is authenticated

})

module.exports = router;
