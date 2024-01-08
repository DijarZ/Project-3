const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

const createProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading image:", err);
        return res.status(500).send("Image upload failed!");
      }
      const { description, productName, price, quantity } = req.body;
      const parsedPrice = parseInt(price, 10);
      const parsedQuantity = parseInt(quantity, 10);
      const image = req.file ? req.file.filename : "";
      const products = await prisma.products.create({
        data: {
          productName,
          description,
          price: parsedPrice,
          quantity: parsedQuantity,
          image,
        },
      });
      console.log("Created Products:", products);
      res.json(products);
    });
  } catch (error) {
    console.error("Error creating Product:", error);

    res.status(500).send("Internal Server Error!");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, quantity, price, image } = req.body;
    const parsedPrice = parseFloat(price);

    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading image:", err);
        return res.status(500).send("Image upload failed");
      }
      const updatedProduct = await prisma.products.update({
        where: { id: parseInt(id) },
        data: {
          productName,
          description,
          price: isNaN(parsedPrice) ? undefined : parsedPrice,
          quantity: parseInt(quantity),
          image: req.file ? `/images/${req.file.filename}` : undefined,
        },
      });

      console.log("Updated Product:", updatedProduct);
      res.json(updatedProduct);
    });
  } catch (error) {
    console.error("Error updating Product:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await prisma.products.delete({
      where: { id: parseInt(id) },
    });
    console.log(("Deleted Product:", deletedProduct));
    res.json(deletedProduct);
  } catch (error) {
    console.error("Error deleting Product:", error);
    res.status(500).send("Internal server Error");
  }
};

const getProducts = async (req, res) => {
  try {
    const allproducts = await prisma.products.findMany();
    res.json(allproducts);
    console.log("Lista e te gjitha produkteve:", allproducts);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server Error");
  }
};

const getProductsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const productsByName = await prisma.products.findMany({
      where: {
        productName: {
          contains: name,
        },
      },
    });

    if (!productsByName || productsByName.length === 0) {
      return res.status(404).json({ error: "Products not found" });
    }

    res.json(productsByName);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productById = await prisma.products.findUnique({
      where: { id: parseInt(id) },
    });
    if (!productById) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(productById);
    console.log(productById);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server Errror");
  }
};
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductsByName,
  getProductById,
};
