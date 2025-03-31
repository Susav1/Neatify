const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prisma"); // Make sure this path is correct
const bcrypt = require("bcryptjs"); // For password hashing and comparison

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Use bcrypt to compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Service Approval & Rejection
router.put("/services/approve/:serviceId", async (req, res) => {
  // Implement your approval logic here
  res.send("Service approved");
});

router.put("/services/reject/:serviceId", async (req, res) => {
  // Implement your rejection logic here
  res.send("Service rejected");
});

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Block Provider
router.put("/providers/block/:providerId", async (req, res) => {
  // Implement your block provider logic here
  res.send("Provider blocked");
});

module.exports = router;
