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

// const express = require("express");
// const router = express.Router();
// const { applyAsCleaner } = require("../controller/cleanerController");

// router.post("/apply", applyAsCleaner);

// module.exports = router;
