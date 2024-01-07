const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany();
    res.json(cart);
    console.log("Lista e te gjitha porosive: ", orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server Error");
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const ordersByUserId = await prisma.orders.findMany({
      where: { userId: parseInt(userId) },
    });
    if (!ordersByUserId || ordersByUserId.length === 0) {
      return res.status(404).json({
        error: `Useri me id:${userId}nuk ka bere ende porosi!`,
      });
    }
    res.json(ordersByUserId);
    console.log(ordersByUserId);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server Errror");
  }
};

const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const removeOrder = await prisma.orders.deleteMany({
      where: { id: parseInt(id) },
    });
    console.log(("Order removed:", removeOrder));
    res.json(removeOrder);
  } catch (error) {
    console.error("Error removing Order:", error);
    res.status(500).send("Internal server Error");
  }
};
const createOrders = async (req, res) => {
  try {
    const { user } = req;

    const newOrder = await prisma.orders.create({
      data: {
        userId: user.id,
        status: "Pending",
      },
    });
    console.log("order created");
    const orderId = newOrder.id;
    res
      .status(200)
      .json({ orderId: newOrder.id, message: "Order created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing checkout" });
  }
};

module.exports = {
  getOrders,
  getOrdersByUserId,
  removeOrder,
  createOrders,
};
