const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "admin@neatify.com",
      password: await bcrypt.hash("securepassword123", 12),
      role: "ADMIN",
    },
  });

  console.log("Admin user created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
