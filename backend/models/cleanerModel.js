const mongoose = require("mongoose");

const cleanerSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Cleaner"],
      default: "Cleaner",
    },
    licenseNumber: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cleaner", cleanerSchema);
