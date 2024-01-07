const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;

const usersRouter = require("./routers/users");
const productsRouter = require("./routers/products");
const shopingCartRouter = require("./routers/shopingcart");
const ordersRouter = require("./routers/orders");
const orderItemsRouter = require("./routers/orderItems");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/", productsRouter);
app.use("/", usersRouter);
app.use("/shopingcart", shopingCartRouter);
app.use("/orders", ordersRouter);
app.use("/orders", orderItemsRouter);
app.use("/images", express.static("images"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
