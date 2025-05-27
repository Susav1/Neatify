const { validationResult } = require("express-validator");
const prisma = require("../prisma/prisma");

const createReview = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      code: "UNAUTHORIZED",
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
      code: "VALIDATION_ERROR",
    });
  }

  try {
    const { serviceId, bookingId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate booking exists and belongs to the user
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
        code: "BOOKING_NOT_FOUND",
      });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to review this booking",
        code: "UNAUTHORIZED",
      });
    }

    if (booking.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        error: "Cannot review a booking that is not completed",
        code: "INVALID_BOOKING_STATUS",
      });
    }

    // Check if a review already exists for this booking
    const existingReview = await prisma.review.findFirst({
      where: { bookingId, userId },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this booking",
        code: "DUPLICATE_REVIEW",
      });
    }

    // Validate serviceId matches the booking's service
    if (booking.serviceId !== serviceId) {
      return res.status(400).json({
        success: false,
        error: "Service ID does not match the booking",
        code: "INVALID_SERVICE_ID",
      });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        serviceId,
        bookingId,
        createdAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });

    return res.status(201).json({
      success: true,
      data: review,
      message: "Review submitted successfully",
      code: "REVIEW_CREATED",
    });
  } catch (error) {
    console.error("Review creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to submit review",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      code: "REVIEW_CREATION_FAILED",
    });
  }
};

module.exports = { createReview };
