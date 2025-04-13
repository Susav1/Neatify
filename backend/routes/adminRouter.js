const express = require("express");
const {
  adminUserLogin,
  getAllUsers,
  getAllCleaners,
} = require("../controller/adminController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/login", adminUserLogin);
router.get("/getAllUsers", getAllUsers);
router.get("/getAllUsers", authenticateToken, getAllUsers);
router.get("/getAllCleaners", authenticateToken, getAllCleaners);

module.exports = router;
