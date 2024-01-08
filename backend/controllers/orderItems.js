const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderItems = await prisma.orderItems.findMany({
      where: { orderId: parseInt(orderId) },
    });
    if (!orderItems) {
      return res.status(404).json({
        error: "Somethign went wrong! No products on this order.",
      });
    }
    res.json(orderItems);
    console.log(orderItems);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server Errror");
  }
};

const createOrderItems = async (req, res) => {
  try {
    const { orderId, orderItems } = req.body;
    const userId = req.user.id;
    console.log(userId);
    for (const item of orderItems) {
      const totalAmount = item.product.price * item.Quantity;
      console.log(totalAmount);
      await prisma.orderItems.create({
        data: {
          order: { connect: { id: orderId } },
          product: { connect: { id: item.product.id } },
          Quantity: item.Quantity,
          totalAmount: totalAmount,
        },
      });
    }
    await prisma.orders.update({
      where: { id: orderId },
      data: { status: "Completed" },
    });

    await prisma.shopingCart.deleteMany({ where: { userId: userId } });

    res.status(200).json({ message: "Order items created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating order items" });
  }
};

const removeProductFromOrder = async (req, res) => {
  try {
    const { productId, orderId } = req.body;

    const removeProducts = await prisma.orderItems.deleteMany({
      where: {
        productId: parseInt(productId),
        orderId: parseInt(orderId),
      },
    });

    console.log("Products removed from order:", removeProducts);
    res.json(removeProducts);
  } catch (error) {
    console.error("Error removing products:", error);
    res.status(500).send("Internal server Error");
  }
};

module.exports = {
  getOrderItems,
  removeProductFromOrder,
  createOrderItems,
};
