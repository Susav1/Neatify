const { z } = require("zod");

// Define the role enum based on your Prisma schema
const RoleEnum = z.enum(["User", "Admin", "Cleaner"]);

// Registration Schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: RoleEnum.default("User"),
  // licenseNumber: z
  //   .string()
  //   .optional()
  //   .refine((val, ctx) => {
  //     console.log("License Number:", ctx); // Debugging line
  //     const role = ctx.parent.role;
  //     if (role === "Cleaner" && !val) {
  //       return ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: "Cleaners must provide a license number",
  //       });
  //     }
  //     return true;
  //   }),
  // phone: z
  //   .string()
  //   .optional()
  //   .refine((val, ctx) => {
  //     const role = ctx.parent.role;
  //     if (role === "Cleaner" && !val) {
  //       return ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: "Cleaners must provide a phone number",
  //       });
  //     }
  //     return true; // Valid phone number or not provided
  //   }, "Invalid phone number format"),
});

// Login Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = { registerSchema, loginSchema };
