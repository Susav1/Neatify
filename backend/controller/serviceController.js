const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createService = async (req, res) => {
  try {
    const { name, description, price, duration, categoryId } = req.body;

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        categoryId,
      },
    });

    return res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ error: "Error creating service" });
  }
};

const getAllServices = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        services: true,
      },
    });
    res.json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch services", error: err.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: {
        category: true, // Include category details
        reviews: true, // Include reviews if needed
      },
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch service", error: err.message });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
};
