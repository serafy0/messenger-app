const Conversation = require("../db/models/conversation");
const Message = require("../db/models/message");
const onlineUsers = require("../onlineUsers");

async function postMessage(req, res, next) {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const existingConversation = await Conversation.findByPk(conversationId);
      if (!existingConversation) {
        return res.sendStatus(404);
      }
      if (
        senderId !== existingConversation.user1Id &&
        senderId !== existingConversation.user2Id
      ) {
        return res.sendStatus(403);
      }
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId
      });
      if (onlineUsers.get(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
}
module.exports = { postMessage };
