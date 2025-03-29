// // serviceModel.js
// const mongoose = require('mongoose');

// // Define the schema for a service
// const serviceSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true, // Service name is mandatory
//   },
//   description: {
//     type: String,
//     required: true, // Description is mandatory
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending', // Initial status is pending
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now, // Timestamp when the service was created
//   },
// });

// // Create the model based on the schema
// const Service = mongoose.model('Service', serviceSchema);

// module.exports = Service; // Export the model


