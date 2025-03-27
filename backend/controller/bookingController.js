const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id }, // From JWT middleware
      include: { service: true },    // Assuming a relation to "service"
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date } = req.body;
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        serviceId,
        date: new Date(date),
        status: "PENDING", // Default status
      },
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Invalid booking data" });
  }
};