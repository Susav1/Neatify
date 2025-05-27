const express = require("express");
const router = express.Router();
const reviewController = require("../controller/reviewController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

router.post(
  "/",
  authenticateToken,
  [
    check("serviceId", "Service ID is required").notEmpty(),
    check("bookingId", "Booking ID is required").notEmpty(),
    check("rating", "Rating must be between 1 and 5").isInt({ min: 1, max: 5 }),
    check("comment", "Comment must be a string").optional().isString(),
  ],
  reviewController.createReview
);

module.exports = router;
