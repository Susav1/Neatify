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
          amount: (service.price * duration * 100).toFixed(0), // Convert to paisa
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

    const booking = await prisma.booking.create({
      data: {
        user: { connect: { id: userId } },
        service: { connect: { id: serviceId } },
        date: bookingDate,
        time,
        location,
        paymentMethod,
        paymentStatus,
        duration: Number.parseInt(duration) || service.duration || 1,
        price:
          service.price * (Number.parseInt(duration) || service.duration || 1),
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
      },
    });

    // TODO: Implement notification to cleaner (e.g., via WebSocket or push notification)
    // Placeholder: Assign a cleaner (simplified logic, replace with your assignment logic)
    const cleaners = await prisma.cleaner.findMany();
    if (cleaners.length > 0) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { cleaner: { connect: { id: cleaners[0].id } } },
      });
    }

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
        });
      }

      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: "COMPLETED" },
      });

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        details: response.data,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
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
      error: "Failed to fetch bookings",
      details: process.env.NODE_ENV === "development" ? error.message : null,
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
        error: "Invalid status",
        validStatuses: ["CANCELLED", "COMPLETED"],
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this booking" });
    }

    const updatedBooking = await prisma.booking.update({
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

    // TODO: Notify cleaner of status change
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      error: "Failed to update booking status",
      details: process.env.NODE_ENV === "development" ? error.message : null,
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
      error: "Failed to fetch bookings",
      details: process.env.NODE_ENV === "development" ? error.message : null,
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
        error: "Invalid status",
        validStatuses: ["CONFIRMED", "CANCELLED", "COMPLETED"],
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.cleanerId !== cleanerId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this booking" });
    }

    const updatedBooking = await prisma.booking.update({
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

    // TODO: Notify user of status change
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      error: "Failed to update booking status",
      details: process.env.NODE_ENV === "development" ? error.message : null,
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
