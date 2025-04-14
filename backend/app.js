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
const path = require("path");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:5173"],
    credentials: true,
  })
);

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/payment", paymentRoutes);
app.use("/services", serviceRouter);
app.use("/cleaners", cleanerRouter);
app.use("/api/bookings", bookingRouter);
app.use("/category", categoryRoute);
app.use(
  "/uploads/icons",
  express.static(path.join(__dirname, "uploads/icons"))
);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
