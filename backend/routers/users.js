// const router = require("express").Router();

// const {
//   getUsers,
//   createUser,
//   updateUser,
//   loginUser,
// } = require("../controllers/users");

// router.get("/getUsers", getUsers),
//   router.post("/createUser", createUser),
//   router.put("/updateUser", updateUser),
//   router.post("/login", loginUser),
//   (module.exports = router);

const router = require("express").Router();

const {
  getUsers,
  createUser,
  updateUser,
  registerUser,
  loginUser,
  deleteUser,
} = require("../controllers/users");

const { verifyToken } = require("../middlewares/verifytoken");
const { isSelfOrAdmin, isAdmin } = require("../middlewares/auth");

// router.get("/getUsers", getUsers);
router.delete("/deleteUser", verifyToken, deleteUser);
router.put("/updateUser", verifyToken, updateUser);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
