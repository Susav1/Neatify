// routes/documentRouter.js
const express = require("express");
const router = express.Router();
const {
  getAllCleanerApplications,
  updateApplicationStatus,
} = require("../controller/documentController");

// Get all cleaner applications
router.get("/", getAllCleanerApplications);

// Update application status
router.patch("/:id", updateApplicationStatus);

module.exports = router;
