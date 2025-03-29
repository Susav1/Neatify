// const express = require("express");
// const router = express.Router();
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// router.get("/users", async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// router.get("/providers", async (req, res) => {
//   const providers = await prisma.user.findMany({ where: { role: "provider" } });
//   res.json(providers);
// });

// router.get("/bookings", async (req, res) => {
//   const bookings = await prisma.booking.findMany();
//   res.json(bookings);
// });

// router.delete("/users/:id", async (req, res) => {
//   const { id } = req.params;
//   await prisma.user.delete({ where: { id: parseInt(id) } });
//   res.json({ message: "User deleted" });
// });

// module.exports = router;

// adminRouter.js
const express = require('express');
const prisma = require('../prisma/prisma'); // Import the initialized Prisma client
const router = express.Router();

// Endpoint to create a new admin
router.post('/admin', async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password,
        name,
      },
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ error: 'Error creating admin' });
  }
});

// Endpoint to fetch all admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching admins' });
  }
});

// Endpoint to create or update a service (Admin can manage services)
router.post('/services', async (req, res) => {
  const { name, description, price, duration, adminId } = req.body;
  
  try {
    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        adminId, // Link to the admin managing the service
      },
    });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Error creating service' });
  }
});

// Endpoint to get all services managed by a specific admin
router.get('/services/:adminId', async (req, res) => {
  const { adminId } = req.params;

  try {
    const services = await prisma.service.findMany({
      where: {
        adminId,
      },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services for admin' });
  }
});

// Endpoint to update a service
router.put('/services/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration } = req.body;

  try {
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        price,
        duration,
      },
    });
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: 'Error updating service' });
  }
});

// Endpoint to delete a service
router.delete('/services/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await prisma.service.delete({
      where: { id },
    });
    res.json(deletedService);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting service' });
  }
});

module.exports = router;
