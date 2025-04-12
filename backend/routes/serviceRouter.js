const express = require("express");
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
} = require("../controller/serviceController");

router.get("/get", getAllServices);
router.get("/:id", getServiceById);
router.post("/create", createService);

module.exports = router;
