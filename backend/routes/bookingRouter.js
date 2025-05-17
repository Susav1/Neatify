const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

// User booking routes
router.post(
  "/",
  authenticateToken,
  [
    check("serviceId", "Service ID is required").notEmpty(),
    check("date", "Valid date is required").isISO8601(),
    check("time", "Time is required").notEmpty(),
    check("location", "Location is required").notEmpty(),
    check("paymentMethod", "Valid payment method is required").isIn([
      "CASH",
      "KHALTI",
    ]),
    check("duration", "Duration is required").isInt({ min: 1 }),
  ],
  bookingController.createBooking
);

router.get("/", authenticateToken, bookingController.getUserBookings);
router.put(
  "/:bookingId/status",
  authenticateToken,
  [check("status", "Status is required").isIn(["CANCELLED", "COMPLETED"])],
  bookingController.updateBookingStatus
);

// Cleaner booking routes
router.get("/cleaner", authenticateToken, bookingController.getCleanerBookings);
router.put(
  "/cleaner/:bookingId/status",
  authenticateToken,
  [
    check("status", "Status is required").isIn([
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ]),
  ],
  bookingController.updateCleanerBookingStatus
);

// Payment verification route
router.post(
  "/verify-payment",
  authenticateToken,
  bookingController.verifyPayment
);

module.exports = router;
