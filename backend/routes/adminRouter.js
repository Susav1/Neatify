const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all users
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get all service providers
router.get("/providers", async (req, res) => {
  const providers = await prisma.user.findMany({ where: { role: "provider" } });
  res.json(providers);
});

// Get all bookings
router.get("/bookings", async (req, res) => {
  const bookings = await prisma.booking.findMany();
  res.json(bookings);
});

// Delete User
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: parseInt(id) } });
  res.json({ message: "User deleted" });
});

module.exports = router;