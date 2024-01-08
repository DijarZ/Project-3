const router = require("express").Router();

const {
  getUsers,
  createUser,
  updateUser,
  registerUser,
  loginUser,
  deleteUser,
  getUserById,
} = require("../controllers/users");

const { verifyToken } = require("../middlewares/verifytoken");

router.get("/getUsers", getUsers);
router.delete("/deleteUser/:id", verifyToken, deleteUser);
router.put("/updateUser/:userId", verifyToken, updateUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUserById/:id", getUserById);

module.exports = router;
