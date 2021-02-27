const Product = require("../models/product")
const formidable = require("formidable");
const _ = require("lodash");

//while posting images of product, when admin click browse;
//full path of that image has to be copy, for that fs is required.
const fs = require("fs");
const { sortBy } = require("lodash");

//READ - this is middleware to fetch product based on ID.
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
  .populate("category")
  .exec((err, prod) => {
    if(err){
      res.status(400).json({
        error: "No product found with this ID"
      })
    }
    req.product = prod
    next()
  })

}

//CREATE - create product controller
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  //formidable code
  form.parse(req, (err, fields, file) => {
    if(err) {
      return res.status(400).json({
        error: "Problem with image"
      });
    }

    //destructure the fields
    console.log(fields)
    const {name, description, price, category, stock} = fields

    if( !name || !description || !price || !category || !stock){
      return res.status(400).json({
        error: "Please include all fields"
      })
    }
    
    let product = new Product(fields);

    //handle file here
    if(file.photo){
      if(file.photo.size > 3000000){
        return res.status(400).json({
          error: "File size too big"
        })
      }

      //this two lines saves the requied info of photos, which is data and content-type
      //check photo in product schema for more information
      product.photo.data = fs.readFileSync(file.photo.path)
      product.photo.contentType = file.photo.type;
    }

    //save product to DB

    product.save((err, product) => {
      if(err) {
        console.log(err)
        res.status(400).json({
          
          error: "Failed to save product in DB"
        })
      }
      res.json(product)
    })
  })
}

//////

//READ - get a single product based on id;
exports.getProduct = (req, res) => {
  req.product.photo = undefined
  return res.json(req.product)
}

//middleware for optimising site speed (didnt understood)
exports.photo = (req, res, next) => {
  if(req.product.photo.data){
    res.set("Content-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next();
}
///////

//DELETE - delete single product based on id
exports.deleteProduct = (req, res) => {
  let product = req.product;
  console.log(req.product)

  product.remove((err, deletedProduct) => {
    if(err){
      res.status(400).json({
        error: "This product could not be deleted"
      })
    }
    res.json({
      message: `${deletedProduct.name} has been deleted succesfully`
    })
  })
}

//Update - update single product based on id;
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  //formidable code
  form.parse(req, (err, fields, file) => {
    if(err) {
      return res.status(400).json({
        error: "Problem with image"
      });
    }

    //updation code:
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    if(file.photo){
      if(file.photo.size > 3000000){
        return res.status(400).json({
          error: "File size too big"
        })
      }

      //this two lines saves the requied info of photos, which is data and content-type
      //check photo in product schema for more information
      product.photo.data = fs.readFileSync(file.photo.path)
      product.photo.contentType = file.photo.type;
    }

    //save product to DB

    product.save((err, product) => {
      if(err) {
        res.status(400).json({
          error: "Failed to update product in DB"
        })
      }
      res.json(product)
    })
  })
}

//READ - Listing controller - (get all products just like get all users) - (this route will show all products just like when we go to main page of amazon.in all products are shown. We have to limit how many products we want to show on the page)
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
  //select: this function will let us choose what fields we want to select, giving negative(-) sign means we dont want to select those fields.
  //Here we said photos because they are big in size.
  .select("-photo")
  .populate("category")
  .sort([[sortBy, "asc"]])
  // this will send only given number of products to frontend
  .limit(limit)

  .exec((err, products) => {
    if (err){
      res.status(400).json({
        error: "No products found in DB"
      })
    }
    res.json(products)
  })
}

//middleware to increase sold items and decrease stock when user place order succesfully
exports.updateStock = (req, res, next) => {
  //Inside mongoDb bulkwrite, we have to give two functions i.e. filter and update.
  //user may have more than 1 item inside his cart, so we weill loop through each 
  //item and for each item we will update the sold items and stock

  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: {_id: prod._id},
        update: {$inc: {stock: -prod.count, sold: +prod.count}}
      }
    }
  })

  //this is main function

  https://mongoosejs.com/docs/api.html#model_Model.bulkWrite

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if(err){
      return res.status(400).json({
        error: "Bulk operation failed"
      })
    }
    next();
  })
}

//READ - while admin uploading product, he has to choose category, it will be populated and cant be created by admin
exports.getAllUniqueCategories = (req, res,) => {
  Product.distinct("category", {}, (err, category) => {
    if(err){
      res.status(400).json({
        error: "No category found"
      })
    }
    res.json(category)
  })
}