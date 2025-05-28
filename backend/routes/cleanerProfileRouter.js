// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middlewares/authMiddleware");
// const multer = require("multer");
// const path = require("path");
// const Cleaner = require("../models/cleanerModel");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "Uploads/profiles/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = filetypes.test(file.mimetype);
//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error("Images only (jpeg, jpg, png)!"));
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// router.get("/me", authMiddleware.authenticateToken, async (req, res) => {
//   try {
//     const cleaner = await Cleaner.findById(req.user.id);
//     if (!cleaner) {
//       return res.status(404).json({ message: "Cleaner not found" });
//     }
//     res.status(200).json(cleaner);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get cleaner profile" });
//   }
// });

// router.put(
//   "/profile",
//   authMiddleware.authenticateToken,
//   upload.single("profilePic"),
//   async (req, res) => {
//     try {
//       const { name, phone } = req.body;
//       const profilePicture = req.file
//         ? `/uploads/profiles/${req.file.filename}`
//         : undefined;
//       const updatedCleaner = await Cleaner.findByIdAndUpdate(
//         req.user.id,
//         { name, phone, profilePicture },
//         { new: true }
//       );

//       if (!updatedCleaner) {
//         return res.status(404).json({ message: "Cleaner not found" });
//       }
//       res.status(200).json(updatedCleaner);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Failed to update profile" });
//     }
//   }
// );

// module.exports = router;
