const router = require("express").Router();

const {
  getCart,
  getCartByUserId,
  addProductToCart,
  removeProductById,
  removeProductsByUserId,
  updateCartQuantity,
} = require("../controllers/shopingcart");

router.get("/getcart", getCart);
router.get("/cart/user/:id", getCartByUserId);
router.post("/cart/add", addProductToCart);
router.put("/update/cart/quantity", updateCartQuantity);
router.delete("/cart/remove/product/:id", removeProductById);
router.delete("/cart/remove/user/:userId", removeProductsByUserId);

module.exports = router;
