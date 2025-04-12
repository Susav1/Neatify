const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { loginSchema, registerSchema } = require("../utils/userSchema");
const { config } = require("../config");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const adminUserLogin = async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.errors });
    }

    const { email, password } = req.body;

    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const isPasswordValid = await bcrypt.compare(hashedPassword, user.password);
    if (isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Admin Login successful", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const approveService = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: { status: "APPROVED" },
    });
    res.json({ message: "Service approved", service });
  } catch (error) {
    res.status(500).json({ error: "Error approving service" });
  }
};

const rejectService = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: { status: "REJECTED" },
    });
    res.json({ message: "Service rejected", service });
  } catch (error) {
    res.status(500).json({ error: "Error rejecting service" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const blockProvider = async (req, res) => {
  const { providerId } = req.params;

  try {
    const provider = await prisma.user.update({
      where: { id: providerId },
      data: { blocked: true },
    });
    res.json({ message: "Provider blocked", provider });
  } catch (error) {
    res.status(500).json({ error: "Error blocking provider" });
  }
};

module.exports = {
  adminUserLogin,
  approveService,
  rejectService,
  getAllUsers,
  blockProvider,
};
