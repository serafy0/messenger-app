const { conversationToJSON } = require("../helpers/conversationToJSON");
const { Conversation, Message } = require("../db/models");

async function readConversation(req, res) {
  const { conversationId } = req.body;
  const userId = req.user.id;

  if (!req.user) {
    return res.sendStatus(401);
  }

  if (!conversationId) {
    return res.sendStatus(400);
  }

  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) {
    return res.sendStatus(403);
  }
  if (userId !== conversation.user1Id && userId !== conversation.user2Id) {
    return res.sendStatus(403);
  }

  const lastSeen = await Message.updateMessagesToSeen(conversationId, userId);

  return res.sendStatus(204);
}

async function getConversations(req, res, next) {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAllConversationsWithUser(
      userId
    );
    for (let i = 0; i <= conversations.length - 1; i++) {
      conversations[i] = await conversationToJSON(conversations[i], userId);
    }
    res.json(conversations.reverse());
  } catch (error) {
    next(error);
  }
}

module.exports = { readConversation, getConversations };
