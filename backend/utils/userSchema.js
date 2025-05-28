const { z } = require("zod");

// Define the role enum based on your Prisma schema
const RoleEnum = z.enum(["User", "Admin", "Cleaner"]);

// Registration Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: RoleEnum.default("User"),
});

// Login Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = { registerSchema, loginSchema };
