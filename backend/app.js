const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const bookingRouter = require("./routes/bookingRouter");
const paymentRoutes = require("./routes/paymentRouter");
const serviceRouter = require("./routes/serviceRouter");
const cleanerRouter = require("./routes/cleanerRouter");
const categoryRoute = require("./routes/categoryRoute");
const documentRouter = require("./routes/documentRouter");
const messageRouter = require("./routes/messageRouter");
const profileRouter = require("./routes/profileRouter");
const path = require("path");
const fs = require("fs");
const { upload } = require("./middlewares/upload");

// Create Uploads/icons directory if it doesn't exist
const uploadsDir = path.join(__dirname, "Uploads/icons");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("[app] Created Uploads/icons directory");
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:5173",
      "http://10.0.2.2:8081",
      "http://localhost:19006", // Expo web port
      "http://192.168.1.100:8081", // Replace with your machine's IP
    ],
    credentials: true,
  })
);

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/admin", documentRouter);
app.use("/cleaners", cleanerRouter);
app.use("/payment", paymentRoutes);
app.use("/services", serviceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/category", categoryRoute);
app.use("/api/messages", messageRouter);
app.use("/profile", profileRouter);

app.use(
  "/uploads/icons",
  express.static(path.join(__dirname, "Uploads/icons"))
);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app, upload };
