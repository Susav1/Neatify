const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fetch all bookings for a cleaner
exports.getCleanerBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        service: {
          userId: req.user.id, // Cleaner's own services
        },
        status: {
          in: ["PENDING", "CONFIRMED"], // Only show pending and confirmed
        },
      },
      include: {
        service: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, address, notes } = req.body;

    if (!serviceId || !date || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        serviceId: serviceId,
        date: new Date(date),
        address: address,
        notes: notes || "",
        status: "PENDING",
      },
      include: {
        service: true,
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Unable to create booking" });
  }
};

// Update booking status (for cleaners)
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["CONFIRMED", "REJECTED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    // First verify the cleaner owns the service for this booking
    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: { service: true },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.service.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this booking" });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: id },
      data: { status: status },
      include: {
        service: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        service: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
