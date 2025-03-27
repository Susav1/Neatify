// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, default: "user" },
// });

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  role: { type: String, enum: ['user', 'serviceProvider', 'admin'], default: 'user' }, // Added role
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
