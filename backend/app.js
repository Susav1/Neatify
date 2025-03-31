const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const bookingRouter = require("./routes/bookingRouter");
const { config } = require("./config");
const prisma = require("./prisma/prisma");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/bookings", bookingRouter);

const port = config.port || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
