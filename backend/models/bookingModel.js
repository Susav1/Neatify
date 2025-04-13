// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   serviceId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Service",
//     required: true,
//   },
//   date: Date,
//   status: {
//     type: String,
//     enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
//     default: "PENDING",
//   },
//   name: String,
//   phone: String,
//   address: String,
//   notes: String,
//   price: Number,
//   duration: Number,
//   areas: [String],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Booking", bookingSchema);
