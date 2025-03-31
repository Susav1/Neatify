const User = require("../models/userModel");
const Service = require("../models/serviceModel");

const approveService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findByIdAndUpdate(serviceId, { status: "approved" }, { new: true });

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service approved", service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findByIdAndUpdate(serviceId, { status: "rejected" }, { new: true });

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json({ message: "Service rejected", service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const blockProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = await User.findByIdAndUpdate(providerId, { status: "blocked" }, { new: true });

    if (!provider) return res.status(404).json({ message: "Provider not found" });

    res.json({ message: "Provider blocked", provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  approveService,
  rejectService,
  getAllUsers,
  blockProvider
};
