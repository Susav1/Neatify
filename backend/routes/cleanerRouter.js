const express = require("express");
const {
  registerCleaner,
  loginCleaner,
  logoutCleaner,
} = require("../controller/cleanerController");
const router = express.Router();

router.post("/register", registerCleaner);
router.post("/login", loginCleaner);
router.get("/logout", logoutCleaner);

module.exports = router;
