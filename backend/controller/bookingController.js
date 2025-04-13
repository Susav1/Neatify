const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const Service = require("../models/serviceModel");
const User = require("../models/userModel");
// const { validationResult } = require("express-validator");

const createBooking = async (req, res) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  // return res.status(400).json({ errors: errors.array() });
  // }

  try {
    const { serviceId } = req.body; // Default status to 'PENDING'

    // Check if serviceId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: "Invalid service ID" });
    }

    // Check if the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const booking = new Booking({
      user: req.user.id, // From authentication middleware
      service: serviceId,
    });

    await booking.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("service")
      .populate("user");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { serviceId, date, time, status } = req.body;

    if (serviceId) {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({ error: "Invalid service ID" });
      }

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      booking.service = serviceId;
    }

    if (date) booking.date = date;
    if (time) booking.time = time;
    if (status) booking.status = status;

    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  updateBooking,
  deleteBooking,
};
