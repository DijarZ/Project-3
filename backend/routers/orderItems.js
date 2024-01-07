const router = require("express").Router();

const {
  getOrderItems,
  removeProductFromOrder,
  addProductToOrder,
  createOrderItems,
} = require("../controllers/orderItems");
const { verifyToken } = require("../middlewares/verifytoken");

router.get("/orders/details/:id", getOrderItems);
router.delete("/orders/remove/product/:id", removeProductFromOrder);
router.post("/orderitems/add/product", addProductToOrder);
router.post("/createOrderItems", verifyToken, createOrderItems); // Krijimi i porosisë

module.exports = router;
