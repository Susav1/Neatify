// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// exports.getUserBookings = async (req, res) => {
//   try {
//     const bookings = await prisma.booking.findMany({
//       where: { userId: req.user.id },
//       include: { service: true },
//     });
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch bookings" });
//   }
// };

// exports.createBooking = async (req, res) => {
//   try {
//     const { serviceId, date } = req.body;
//     const booking = await prisma.booking.create({
//       data: {
//         userId: req.user.id,
//         serviceId,
//         date: new Date(date),
//         status: "PENDING",
//       },
//     });
//     res.status(201).json(booking);
//   } catch (error) {
//     res.status(400).json({ error: "Invalid booking data" });
//   }
// };
