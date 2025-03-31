const express = require("express");
const {
  registerUser,
  loginUser
//   logout,
//   msgUser, 
//   getUserProfile,
//   forgotPassword,
//   resetPassword,
//   updateUserProfile,
} = require("../controller/userController");
const router = express.Router();

// Define routes
// router.get("/", msgUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/profile", getUserProfile);
// router.get("/logout", logout);
// router.post("/forgot-pass",forgotPassword );
// router.post("/reset-pass",resetPassword );
// router.put("/profile",updateUserProfile)


module.exports = router;
