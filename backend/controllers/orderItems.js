const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderItems = await prisma.orderItems.findUnique({
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

    for (const item of orderItems) {
      // Calculate totalAmount based on the price and quantity of the product
      const totalAmount = item.product.price * item.Quantity; // Example calculation, adjust according to your data model
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
const addProductToOrder = async (req, res) => {
  try {
    // Extract necessary data from the request body
    const { orderId, productId, quantity } = req.body;

    // Validate if orderId, productId, and quantity are present
    if (!orderId || !productId || !quantity) {
      return res.status(400).json({
        error:
          "Incomplete data. Please provide orderId, productId, and quantity.",
      });
    }

    // Fetch the order based on orderId from the database
    const order = await prisma.orders.findUnique({
      where: { id: parseInt(orderId) },
    });

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Fetch the product based on productId from the database
    const product = await prisma.products.findUnique({
      where: { id: parseInt(productId) },
    });

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Add the product to the order items with the specified quantity
    const newOrderItem = await prisma.orderItems.create({
      data: {
        orderId: parseInt(orderId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        // Additional details as required
      },
    });

    // Return the newly added order item
    res.status(201).json(newOrderItem);
  } catch (error) {
    console.error("Error adding products to order:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getOrderItems,
  removeProductFromOrder,
  addProductToOrder,
  createOrderItems,
};
