const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/upload");
const router = express.Router();
const prisma = new PrismaClient();

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("[profileRouter] Error fetching profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.put("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePicture: true,
      },
    });

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("[profileRouter] Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post(
  "/upload-profile-picture",
  authenticateToken,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      console.log("[profileRouter] Request files:", req.file); // Debug log
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.id;
      const profilePicturePath = `/uploads/icons/${req.file.filename}`;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: profilePicturePath },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profilePicture: true,
        },
      });

      res
        .status(200)
        .json({ message: "Profile picture uploaded successfully", user });
    } catch (error) {
      console.error("[profileRouter] Error saving profile picture:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

module.exports = router;
