const router = require("express").Router();

const {
  getOrderItems,
  removeProductFromOrder,
  createOrderItems,
} = require("../controllers/orderItems");
const { verifyToken } = require("../middlewares/verifytoken");

router.get("/orders/details/:orderId", getOrderItems);
router.delete("/orders/remove/product", removeProductFromOrder);
router.post("/createOrderItems", verifyToken, createOrderItems);

module.exports = router;
