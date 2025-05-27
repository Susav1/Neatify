const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getAllUsers,
  applyAsCleaner,
} = require("../controller/userController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateToken, logout);
router.get("/getAll", authenticateToken, getAllUsers);

module.exports = router;
