const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  createMessage,
  getConversations,
  getMessages,
} = require("../controller/messageController");

router.post("/", authenticateToken, createMessage);
router.get("/", authenticateToken, getConversations);
router.get("/:conversationId/messages", authenticateToken, getMessages);

module.exports = router;
