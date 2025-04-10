const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const bookingRouter = require("./routes/bookingRouter");
const paymentRoutes = require("./routes/paymentRouter");
const { config } = require("./config");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:8081", // Replace with your frontend URL
    credentials: true,
  })
);

// Define routes
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/bookings", bookingRouter);
app.use("/payment", paymentRoutes);

const port = config.port || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
