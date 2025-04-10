// routes/paymentRouter.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/initiate", async (req, res) => {
  try {
    const { amount, return_url } = req.body;

    const data = {
      return_url: return_url || "http://localhost:8081/lists",
      website_url: "http://localhost:8081/",
      amount: amount * 100, // Convert to paisa
      purchase_order_id: `order_${Date.now()}`,
      purchase_order_name: "Cleaning Service",
      customer_info: {
        name: "Cleaning Service",
        email: "susav100@gmail.com",
        phone: "9767569334",
      },
      amount_breakdown: [
        { label: "Ticket Price", amount: amount * 100 },
        { label: "VAT", amount: 0 },
      ],
      product_details: [
        {
          identity: "Cleaning_service",
          name: "Cleaning Service",
          total_price: amount * 100,
          quantity: 1,
          unit_price: amount * 100,
        },
      ],
    };

    const headers = {
      Authorization: "Key 68cd2f53bf2045e5b2707dd70d2e8ac7",
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      data,
      { headers }
    );

    res.json({
      success: true,
      payment_url: response.data.payment_url,
    });
  } catch (error) {
    console.error(
      "Payment initiation error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: error.response?.data?.detail || "Payment initiation failed",
    });
  }
});

module.exports = router;
