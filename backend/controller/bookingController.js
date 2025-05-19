const { validationResult } = require("express-validator");
const prisma = require("../prisma/prisma");
const axios = require("axios");

const createBooking = async (req, res) => {
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
    const {
      serviceId,
      date,
      time,
      location,
      paymentMethod,
      duration = 1,
      notes,
      areas = [],
    } = req.body;
    const userId = req.user.id;

    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date",
        message: "Please provide a valid date in YYYY-MM-DD format",
        code: "INVALID_DATE",
      });
    }

    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return res.status(400).json({
        success: false,
        error: "Invalid time",
        message: "Please provide time in HH:MM format (24-hour)",
        code: "INVALID_TIME",
      });
    }

    // Check for duplicate booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId,
        serviceId,
        date: bookingDate,
        time,
        status: { not: "CANCELLED" },
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        error: "Duplicate booking",
        message: "A booking for this service, date, and time already exists",
        code: "DUPLICATE_BOOKING",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        message: "User not found or invalid user ID",
        code: "USER_NOT_FOUND",
      });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { user: true },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
        message: `Service with ID ${serviceId} not found`,
        code: "SERVICE_NOT_FOUND",
      });
    }

    let paymentStatus = paymentMethod === "CASH" ? "COMPLETED" : "PENDING";
    let pidx = null;

    if (paymentMethod === "KHALTI") {
      const paymentResponse = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        {
          return_url: "http://localhost:8081/payment/verify",
          website_url: "http://localhost:8081/",
          amount: (service.price * duration * 100).toFixed(0),
          purchase_order_id: `booking_${Date.now()}`,
          purchase_order_name: service.name,
          customer_info: {
            name: user.name,
            email: user.email || "susav100@gmail.com",
            phone: user.phone || "9767569334",
          },
        },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          },
        }
      );

      pidx = paymentResponse.data.pidx;
    }

    const cleaners = await prisma.cleaner.findMany({
      where: {
        // Add filters like availability or location if needed
      },
    });

    if (cleaners.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No cleaners available",
        message:
          "No cleaners are currently available to assign to this booking",
        code: "NO_CLEANERS_AVAILABLE",
      });
    }

    const selectedCleaner =
      cleaners[Math.floor(Math.random() * cleaners.length)];

    // Use a transaction to ensure data consistency
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          user: { connect: { id: userId } },
          service: { connect: { id: serviceId } },
          cleaner: { connect: { id: selectedCleaner.id } },
          date: bookingDate,
          time,
          location,
          paymentMethod,
          paymentStatus,
          duration: Number.parseInt(duration) || service.duration || 1,
          price:
            service.price *
            (Number.parseInt(duration) || service.duration || 1),
          status: "PENDING",
          notes,
          areas,
          pidx,
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              user: { select: { id: true, name: true } },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          cleaner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
      return newBooking;
    });

    return res.status(201).json({
      success: true,
      data: {
        ...booking,
        payment_url: pidx ? `https://khalti.com/payment/${pidx}` : null,
      },
      message: "Booking created successfully",
      code: "BOOKING_CREATED",
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Booking failed",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      code: "BOOKING_FAILED",
    });
  }
};

const verifyPayment = async (req, res) => {
  const { pidx } = req.body;

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === "Completed") {
      const booking = await prisma.booking.findFirst({
        where: { pidx },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
          code: "BOOKING_NOT_FOUND",
        });
      }

      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: "COMPLETED" },
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        code: "PAYMENT_VERIFIED",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        details: response.data,
        code: "PAYMENT_VERIFICATION_FAILED",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      code: "PAYMENT_VERIFICATION_ERROR",
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
        cleaner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      code: "FETCH_BOOKINGS_FAILED",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!["CANCELLED", "COMPLETED"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
        validStatuses: ["CANCELLED", "COMPLETED"],
        code: "INVALID_STATUS",
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
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
        error: "Unauthorized to update this booking",
        code: "UNAUTHORIZED",
      });
    }

    const updatedBooking = await prisma.$transaction(async (tx) => {
      return await tx.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          cleaner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });
    });

    res.status(200).json({
      success: true,
      data: updatedBooking,
      message: "Booking status updated successfully",
      code: "BOOKING_STATUS_UPDATED",
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update booking status",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      code: "UPDATE_BOOKING_STATUS_FAILED",
    });
  }
};

const getCleanerBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {
      cleanerId: req.user.id,
    };

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching cleaner bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bookings",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      code: "FETCH_CLEANER_BOOKINGS_FAILED",
    });
  }
};

const updateCleanerBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const cleanerId = req.user.id;

    if (!["CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
        validStatuses: ["CONFIRMED", "CANCELLED", "COMPLETED"],
        code: "INVALID_STATUS",
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: {
          select: {
            id: true,
            userId: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
        code: "BOOKING_NOT_FOUND",
      });
    }

    if (booking.cleanerId !== cleanerId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized to update this booking",
        code: "UNAUTHORIZED",
      });
    }

    // Validate status transition
    const validTransitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["COMPLETED", "CANCELLED"],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status transition",
        message: `Cannot change status from ${booking.status} to ${status}`,
        code: "INVALID_STATUS_TRANSITION",
      });
    }

    const updatedBooking = await prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status },
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          cleaner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (status === "CONFIRMED") {
        // Create or find a conversation
        let conversation = await tx.conversation.findFirst({
          where: {
            userId: booking.userId,
            cleanerId,
            serviceId: booking.serviceId,
            isGroup: false,
          },
        });

        if (!conversation) {
          conversation = await tx.conversation.create({
            data: {
              userId: booking.userId,
              cleanerId,
              serviceId: booking.serviceId,
              isGroup: false,
            },
          });
        }

        // Send automatic message
        await tx.message.create({
          data: {
            conversationId: conversation.id,
            senderId: cleanerId,
            senderType: "Cleaner",
            content: `Hello ${booking.user.name}, I am your cleaner for the ${booking.service.name} service. Looking forward to assisting you!`,
          },
        });
      }

      return updated;
    });

    res.status(200).json({
      success: true,
      data: updatedBooking,
      message: "Cleaner booking status updated successfully",
      code: "CLEANER_BOOKING_STATUS_UPDATED",
    });
  } catch (error) {
    console.error("Error updating cleaner booking status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update cleaner booking status",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      code: "UPDATE_CLEANER_BOOKING_STATUS_FAILED",
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  updateBookingStatus,
  getCleanerBookings,
  updateCleanerBookingStatus,
  verifyPayment,
};
