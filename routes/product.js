// import....
const express = require("express")
const router = express.Router()

// import controllers
const {
  create,
  list,
  read,
  update,
  remove,
  listBy,
  searchFilters,
  createImages,
  removeImage,
} = require("../controllers/product")
const { authCheck, adminCheck } = require("../middlewares/authCheck")

// @ENDPOINT http://localhost:3000/api/product
// create a new product
router.post("/product", create)

// count is a parameter to limit the number of products returned
router.get("/products/:count", list)

// id is a parameter to get a specific product
router.get("/product/:id", read)

// id is a parameter to update a specific product
router.put("/product/:id", update)

// id is a parameter to delete a specific product
router.delete("/product/:id", remove)

// list products by category
router.post("/productsby", listBy)

// search filters for products
router.post("/search/filters", searchFilters)

router.post("/images", authCheck, adminCheck, createImages)
router.post("/removeimages", authCheck, adminCheck, removeImage)

// export router
module.exports = router
