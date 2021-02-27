const User = require("../models/user")
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//controller to create new user or sign up a user
exports.signup = (req, res) => {

  const gotError = validationResult(req)

  if(!gotError.isEmpty()){
    return res.status(422).json({
      error: gotError.errors[0].msg
    })
  }

  const user = new User(req.body)
  user.save((err, user) => {
    if(err){
      res.json({
        message : "failed",
        error: err
      })
    }
    res.json({
      name: user.name,
      email:user.email,
      id: user._id
    })
  })
}

//Read - This one helps user to sign in
exports.signin = (req, res) => {
  const {email, password} = req.body

  const gotError = validationResult(req)

  if(!gotError.isEmpty()){
    return res.status(422).json({
      error: gotError.errors[0].msg
    })
  }

  User.findOne({email}, (err, user) => {
    if(err || !user){
      return res.status(400).json({
        error: "USER email does not exist"
      })
    }

    if(!user.authenticate(password)){
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }

    //create token
    const token = jwt.sign({_id: user.id}, process.env.SECRET)
    //put token in cookie

    res.cookie("token", token, {expire: new Date() + 9999})

    //send response to front end..

    const {_id, name, email, role} = user

    return res.json({
      token, 
      user: {_id, name, email, role}
    })
  })
}

//READ - This one helps user to sign out (clear cookies from browser using cookie parser)
exports.signout = (req, res) => {
  res.clearCookie("token")
  res.json({message: "user signout successfully"})
};

//protected routs 

exports.isSignedIn = expressJwt({
  secret : process.env.SECRET,
  userProperty: "auth",
  algorithms: ['HS256']

  //here req.auth is being returned which will have following structure
  // { _id: '6027fff2ddc96d31080a9caf', iat: 1613408530 }
  //check route auth.js for more info..
  
})

//custom middlewares:

exports.isAuthenticated = (req, res, next) => {

  let checker = req.profile && req.auth && req.profile._id == req.auth._id
  //this req.auth is coming from isSignedIn expressJwt

  if(!checker){
    console.log("Auth failed")
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  console.log("Auth success")
  next();
}

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0){
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    });
  }
  next();
}