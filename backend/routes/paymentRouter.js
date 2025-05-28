const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/initiate", async (req, res) => {
  try {
    const {
      amount,
      return_url,
      purchase_order_id,
      purchase_order_name,
      service_id,
      booking_data,
    } = req.body;

    const data = {
      return_url: return_url || "http://localhost:8081/lists",
      website_url: "http://localhost:8081/",
      amount: amount * 100, // Convert to paisa
      purchase_order_id: purchase_order_id || `order_${Date.now()}`,
      purchase_order_name: purchase_order_name || "Cleaning Service",
      customer_info: {
        name: "Customer",
        email: "customer@example.com",
        phone: "9767569334",
      },
      amount_breakdown: [
        { label: "Service Price", amount: amount * 100 },
        { label: "VAT", amount: 0 },
      ],
      product_details: [
        {
          identity: service_id || "cleaning_service",
          name: purchase_order_name || "Cleaning Service",
          total_price: amount * 100,
          quantity: 1,
          unit_price: amount * 100,
        },
      ],
      // Store booking data for later use
      metadata: {
        service_id,
        booking_data,
      },
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
      pidx: response.data.pidx,
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

// Add payment verification endpoint
router.post("/verify", async (req, res) => {
  try {
    const { pidx } = req.body;

    const headers = {
      Authorization: "Key 68cd2f53bf2045e5b2707dd70d2e8ac7",
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      { headers }
    );

    if (response.data.status === "Completed") {
      res.json({
        success: true,
        message: "Payment verified successfully",
        data: response.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
        status: response.data.status,
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

module.exports = router;
