const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { loginSchema, registerSchema } = require("../utils/cleanerSchema");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const registerCleaner = async (req, res) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.errors });
    }

    const existingCleaner = await prisma.cleaner.findUnique({
      where: { email: req.body.email },
    });

    if (existingCleaner) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const cleaner = await prisma.cleaner.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        role: "Cleaner",
        name: req.body.name,
        phone: req.body.phone,
      },
    });

    res.status(201).json({ cleaner });
  } catch (error) {
    console.error("Cleaner registration error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const loginCleaner = async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.errors });
    }

    const { email, password } = req.body;

    const cleaner = await prisma.cleaner.findUnique({
      where: { email },
    });

    if (!cleaner) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, cleaner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: cleaner.id, email: cleaner.email, role: cleaner.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const logoutCleaner = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllCleaners = async (req, res) => {
  try {
    const cleaners = await prisma.cleaner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(cleaners);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cleaners", error: error.message });
  }
};

const deleteCleaner = async (req, res) => {
  try {
    const { id } = req.params;

    const cleaner = await prisma.cleaner.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cleaner) {
      return res.status(404).json({ message: "Cleaner not found" });
    }

    await prisma.cleaner.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Cleaner deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting cleaner", error: error.message });
  }
};

module.exports = {
  registerCleaner,
  loginCleaner,
  logoutCleaner,
  getAllCleaners,
  deleteCleaner,
};
