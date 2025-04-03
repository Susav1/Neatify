const mongoose = require("mongoose");

const cleanerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  availability: Array,
  earnings: Number,
});

module.exports = mongoose.model("Cleaner", cleanerSchema);
