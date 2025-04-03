const Cleaner = require("../models/cleanerModel");
const Booking = require("../models/bookingModel");

exports.getCleanerDashboard = async (req, res) => {
  try {
    const cleanerId = req.user.id;
    const earnings = await Booking.aggregate([
      { $match: { cleanerId, status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const bookings = await Booking.find({ cleanerId });
    res.status(200).json({ earnings: earnings[0]?.total || 0, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
