const {Order} = require("../models/order");

//params to get id of prouct and name and price from product model
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if(err){
        return res.status(400).json({
          error: "NO order found in DB"
        })
      }
      req.order = order
      next();
  });
}

//actual routes

// CREATE - create new order

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile

  const order = new Order(req.body.order)

  order.save((err, order) => {
    if(err){
      res.status(400).json({
        error: "Error creating new order"
      })
    }
    console.log("order created succesfully", order)
    res.json(order)
  })
}

//READ - get all orders

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if(err){
        res.status(400).json({
          error: "No orders found in DB"
        })
      }
      res.json(orders)
    })
}

//DELETE cancels the order

exports.cancelOrder = (req, res) => {
  const order = req.order;

  order.remove((err, order) => {
    if(err){
      res.status(400).json({
        error: `Failed to cancel ${order.name} order`
      })
    }
    res.json({
      message: `${order.name} order got canceled succesfully`
    })
  })
}

// Conts for status update and read

//READ - check order status
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues)
}
//UPDATE - update order status
exports.updateStatus = (req, res) => {
  Order.updateOne(
    {_id: req.body.orderId},
    {$set: {status: req.body.status}},
    (err, order) => {
      if(err){
        res.status(400).json({
          error: "Cannot update order status"
        })
      }
      res.json(order)
    }
  )
}



