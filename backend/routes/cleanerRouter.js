const express = require("express");
const { getCleanerDashboard } = require("../controllers/cleanerController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/dashboard", authMiddleware, getCleanerDashboard);

module.exports = router;
