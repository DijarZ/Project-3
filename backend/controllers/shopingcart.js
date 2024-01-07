const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const getCart = async (req, res) => {
  try {
    const cart = await prisma.shopingCart.findMany();
    res.json(cart);
    console.log('Lista e te gjitha produkteve ne "Add To Cart": ', cart);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server Error");
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.id); // Accessing userId from route params

    const cartByUserId = await prisma.shopingCart.findMany({
      where: { userId: userId },
      include: {
        product: true,
      },
    });

    if (!cartByUserId || cartByUserId.length === 0) {
      return res.status(404).json({
        error: `"Add To Cart" is empty for the user with id: ${userId}`,
      });
    }

    res.json(cartByUserId);
    console.log(cartByUserId);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server Error");
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, price } = req.body;

    const existingCartItem = await prisma.shopingCart.findFirst({
      where: {
        userId: parseInt(userId),
        productId: parseInt(productId),
      },
    });

    if (existingCartItem) {
      // If the product already exists in the cart, update the quantity
      const updatedCartItem = await prisma.shopingCart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + parseInt(quantity),
        },
      });

      console.log("Product quantity updated in cart:", updatedCartItem);
      return res.json(updatedCartItem);
    } else {
      // If the product doesn't exist in the cart, create a new entry
      const newCartItem = await prisma.shopingCart.create({
        data: {
          userId: parseInt(userId),
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          // ... other data fields
        },
      });

      console.log("Product added to cart:", newCartItem);
      return res.json(newCartItem);
    }
  } catch (error) {
    console.error("Error adding Product:", error);
    console.log("Error gjate krijimit", error);
    res.status(500).send("Internal Server Error!");
  }
};

const removeProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const existingCartItem = await prisma.shopingCart.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCartItem) {
      return res.status(404).json({ error: "Shopping cart item not found." });
    }

    const removeProduct = await prisma.shopingCart.delete({
      where: { id: parseInt(id) },
    });

    console.log("Product removed from cart:", removeProduct);
    res.json(removeProduct);
  } catch (error) {
    console.log("Error removing product:", error);
    res.status(500).send("Internal server Error");
  }
};

const removeProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Make sure userId is retrieved from req.params or req.body, depending on your setup

    const removeProducts = await prisma.shopingCart.deleteMany({
      where: { userId: parseInt(userId) }, // Assuming userId is an integer
    });

    console.log("Products removed from cart:", removeProducts);
    res.json(removeProducts);
  } catch (error) {
    console.log("Error removing products:", error);
    res.status(500).send("Internal server Error");
  }
};
const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existingCartItem = await prisma.shopingCart.findFirst({
      where: {
        userId: parseInt(userId),
        productId: parseInt(productId),
      },
    });

    if (existingCartItem) {
      // If the product already exists in the cart, update the quantity
      const updatedCartItem = await prisma.shopingCart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: parseInt(quantity),
        },
      });

      console.log("Product quantity updated in cart:", updatedCartItem);
      return res.json(updatedCartItem);
    } else {
      return res.status(404).json({
        error: "Product not found in the cart.",
      });
    }
  } catch (error) {
    console.error("Error updating product quantity in cart:", error);
    res.status(500).send("Internal Server Error!");
  }
};

module.exports = {
  getCart,
  getCartByUserId,
  addProductToCart,
  removeProductById,
  updateCartQuantity,
  removeProductsByUserId,
};
