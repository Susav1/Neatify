const { z } = require("zod");

// Registration Schema for Cleaners
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  licenseNumber: z.string().min(1, "License number is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

// Login Schema (same as user login)
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = { registerSchema, loginSchema };
