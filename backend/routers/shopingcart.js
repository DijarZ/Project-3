const router = require("express").Router();

const {
  getCart,
  getCartByUserId,
  addProductToCart,
  removeProductById,
  removeProductsByUserId,
  checkout,
} = require("../controllers/shopingcart");
const { verifyToken } = require("../middlewares/verifytoken");

router.get("/getcart", getCart);
router.get("/cart/user/:id", getCartByUserId);
router.post("/cart/add", addProductToCart);
router.delete("/cart/remove/product/:id", removeProductById);
router.delete("/cart/remove/user/:userId", removeProductsByUserId);

module.exports = router;
