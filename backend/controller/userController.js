const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { loginSchema, registerSchema } = require("../utils/userSchema");
const { config } = require("../config");

const prisma = new PrismaClient();
const registerUser = async (req, res) => {
  console.log("backend");
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.errors });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma?.user?.create({
      data: {  
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || 'user', 
      }
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("Registration error:", error); 
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
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
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (role === 'Cleaner' && !req.body.licenseNumber) {
    return res.status(400).json({ message: "Cleaners must provide license" });
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      role: role || 'User',
      ...(role === 'Cleaner' && {
        cleanerProfile: {
          create: { licenseNumber: req.body.licenseNumber }
        }
      })
    }
  });
  res.status(201).json(user);
};

module.exports = {
  registerUser,
  loginUser,
};

