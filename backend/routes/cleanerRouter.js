const express = require("express");
const {
  registerCleaner,
  loginCleaner,
  logoutCleaner,
  getAllCleaners,
  deleteCleaner,
} = require("../controller/cleanerController");
const router = express.Router();

router.post("/register", registerCleaner);
router.post("/login", loginCleaner);
router.get("/logout", logoutCleaner);
router.get("/getAll", getAllCleaners);
router.delete("/delete/:id", deleteCleaner);
module.exports = router;
