const router = require("express").Router();

const {
  getOrders,
  getOrdersByUserId,
  removeOrder,
  createOrders,
} = require("../controllers/orders");
const { verifyToken } = require("../middlewares/verifytoken");

router.get("/getorders", getOrders);
router.get("/getOrders/user", verifyToken, getOrdersByUserId);
router.delete("/cart/remove/:id", removeOrder);
router.post("/createOrders", verifyToken, createOrders);

module.exports = router;
