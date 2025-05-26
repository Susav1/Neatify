const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { loginSchema, registerSchema } = require("../utils/userSchema");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
    }

    const { name, email, password, phone, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role || "User", // Default to User if role not provided
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registration successful",
      user,
      token,
    });
  } catch (error) {
    console.error("[userController] Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const loginUser = async (req, res) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.errors });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("[userController] Login error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("[userController] Logout error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("[userController] Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  logout,
};
