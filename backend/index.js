const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;

const usersRouter = require("./routers/users");
const productsRouter = require("./routers/products");
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/", productsRouter);
app.use("/", usersRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
