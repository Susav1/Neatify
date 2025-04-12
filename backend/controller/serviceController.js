const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createService = async (req, res) => {
  try {
    // const { name, description, price, duration, image, category } = req.body;
    const { name, description, price, duration } = req.body;

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
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
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch services", error: err.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
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
