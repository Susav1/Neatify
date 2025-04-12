const { z } = require("zod");

const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be a positive number"),
  duration: z.number().positive("Duration must be a number (in minutes)"),
  image: z.string().optional(),
  category: z.enum(["Home Cleaning", "Office Cleaning", "Carpet Cleaning"]),
});

module.exports = { serviceSchema };
