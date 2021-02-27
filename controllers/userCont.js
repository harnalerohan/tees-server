const User = require("../models/user");
const {Order} = require("../models/order");


//READ - controller for id param
exports.getUserById = (req, res, next, id) =>{
  User.findById(id).exec((err, user) => {
    if(err || !user){
      return res.status(400).json({
        error: "No user was found in db"
      })
    }
    req.profile = user
    next();
  })
}

//READ - returns id based single user, from param controller
exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  return res.json(req.profile)
}

//UPDATE - this one helps user to update his profile information
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    {_id : req.profile.id},
    {$set: req.body},
    (err, user) => {
      if(err){
        return res.status(400).json({
          error: "You are not authorised to update this user"
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  )
}

//middleware which stores order in user purchase array
exports.PushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    })
  })

  //store this in db:
  User.findOneAndUpdate(
    {_id: req.profile},
    {$push: {purchases: purchases}},
    {new: true},

    (err, purchases) => {
      if(err){
        return res.send(400).json({
          error: "Unable to save purchase list"
        })
      }
      
      next()
    }
  )
}

//Read - this one helps user to see all his orders.
exports.userPurchaseList = (req, res) => {
  Order.find({user: req.profile._id})
  .populate("user", "_id name")
  .exec((err, order) => {
    if(err){
      return res.status(400).json({
        error: "no orders in this account"
      })
    }
    return res.json(order)
  })
}

