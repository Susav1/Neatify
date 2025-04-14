const express = require("express");
const {
  createCategory,
  getAllCategories,
} = require("../controller/categoryController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/upload"); // Assuming you have a middleware for file upload
const router = express.Router();

router.post("/", upload.single("icon"), authenticateToken, createCategory);
router.get("/", authenticateToken, getAllCategories);

module.exports = router;
