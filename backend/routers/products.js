const router = require("express").Router();

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require("../controllers/products");

router.post("/createProduct", createProduct);
router.put("/updateProduct/:id", updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.get("/getProducts", getProducts);
router.get("/productId/:id", getProductById);
module.exports = router;
