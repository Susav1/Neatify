const axios = require("axios");
require("dotenv").config();

const initiatePayment = async (req, res) => {
  const { amount, mobile, purchase_order_id, purchase_order_name, userName } =
    req.body;

  try {
    const response = await axios.post(
      "https://khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "http://localhost:8081/lists",
        website_url: "http://localhost:8081/lists",
        amount: amount * 100,
        purchase_order_id,
        purchase_order_name,
        customer_info: {
          name: userName[0],
          email: "susav100@gmail.com",
          phone: "9767569334",
        },
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
    });
  }
};

const verifyPayment = async (req, res) => {
  const { pidx } = req.body;

  try {
    const response = await axios.post(
      "https://khalti.com/api/v2/epayment/lookup/",
      {
        pidx,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === "Completed") {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
};
