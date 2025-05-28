const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllCleanerApplications = async (req, res) => {
  try {
    const applications = await prisma.cleanerApplication.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Update the application status
    const updatedApplication = await prisma.cleanerApplication.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    // If approved, update the user's role and cleanerStatus
    if (status === "APPROVED") {
      await prisma.user.update({
        where: { id: updatedApplication.userId },
        data: {
          role: "Cleaner",
          cleanerStatus: "APPROVED",
        },
      });
    }

    // If rejected, just update the cleanerStatus
    if (status === "REJECTED") {
      await prisma.user.update({
        where: { id: updatedApplication.userId },
        data: { cleanerStatus: "REJECTED" },
      });
    }

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCleanerApplications,
  updateApplicationStatus,
};
