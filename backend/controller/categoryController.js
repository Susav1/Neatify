const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const icon = `uploads/icons/${req.file.filename}`;

    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and icon are required." });
    }

    const category = await prisma.category.create({
      data: {
        name,
        icon,
      },
    });

    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get All Categories Error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
};
