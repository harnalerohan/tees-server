const Category = require("../models/category")

//params controller
exports.getCategoryById = (req, res, next, id) => {

  Category.findById(id).exec((err, cate) => {
    if(err){
      return res.status(400).json({
        error: "Category not found in DB"
      })
    }else{
    req.category = cate;
    next();
    }
  })
};

//actual controllers:

//create - create category
exports.createCategory = (req, res) => {
  console.log(req.body)
  const category = new Category(req.body)

  category.save((err, category) => {
    if(err){
      res.status(400).json({
        error: "Category couldnt be saved in DB"
      })
    }
    res.json({category})
  })
}

//Read - get Id based single category
exports.getCategory = (req, res) => {
  res.json(req.category)
}

//Read - Get all categories
exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if(err){
      res.status(400).json({
        error: "No categories available in DB"
      })
    }
    return res.json(categories)
  })
}

//UPDATE - update category by id
exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name

  console.log(req.body)

  category.save((err, updatedCategory) => {
    if(err){
      console.log(err)
      return res.status(400).json({
        error: "Failed to update category"
      });
    }
    res.json(updatedCategory);
  })
}

//DELETE - delete category by id
exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if(err){
      res.status(400).json({
        error: `Failed to delete ${category.name} category`
      })
    }
    res.json({
      message: `${category.name} category got Deleted succesfully`
    })
  })
}


