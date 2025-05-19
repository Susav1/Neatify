const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createMessage = async (req, res) => {
  try {
    const { content, serviceId, conversationId } = req.body;
    const senderId = req.user.id;
    const senderType = req.user.role === "Cleaner" ? "Cleaner" : "User";

    let conversation;

    if (conversationId) {
      // Continue existing conversation
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: true },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Check if user or cleaner is authorized to send message
      if (
        conversation.userId !== senderId &&
        conversation.cleanerId !== senderId &&
        senderType !== "Cleaner"
      ) {
        return res.status(403).json({ error: "Unauthorized to send message" });
      }
    } else if (serviceId && senderType === "User") {
      // Create new group conversation for all cleaners
      conversation = await prisma.conversation.create({
        data: {
          userId: senderId,
          serviceId,
          isGroup: true,
        },
      });
    } else {
      return res
        .status(400)
        .json({ error: "Service ID or Conversation ID required" });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId,
        senderType,
        content,
      },
      include: {
        conversation: {
          include: { user: true, cleaner: true, service: true },
        },
      },
    });

    // If a cleaner responds to a group chat, convert to one-on-one
    if (senderType === "Cleaner" && conversation.isGroup) {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          isGroup: false,
          cleanerId: senderId,
        },
      });

      // Notify other cleaners (optional, could be handled via WebSocket)
      // For now, other cleaners will no longer see the conversation
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userId: role === "User" ? userId : undefined },
          { cleanerId: role === "Cleaner" ? userId : undefined },
          {
            AND: [
              { isGroup: true },
              { userId: role === "User" ? userId : undefined },
              { cleanerId: null },
            ],
          },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        cleaner: { select: { id: true, name: true, email: true } },
        service: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { user: true, cleaner: true },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (
      conversation.userId !== userId &&
      conversation.cleanerId !== userId &&
      !(conversation.isGroup && role === "Cleaner")
    ) {
      return res.status(403).json({ error: "Unauthorized to view messages" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        user: { select: { name: true } },
        cleaner: { select: { name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

module.exports = {
  createMessage,
  getConversations,
  getMessages,
};
