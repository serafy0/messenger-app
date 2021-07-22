const Sequelize = require("sequelize");
const db = require("../db");
const { Op } = require("sequelize");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  seen: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

Message.updateMessagesToSeen = async function (conversationId, userId) {
  await Message.update(
    { seen: true },
    {
      where: {
        [Op.and]: [
          { conversationId: conversationId },
          { senderId: { [Op.not]: userId } },
          { seen: false }
        ]
      }
    }
  );
};
Message.findLastMessageSeen = async function (userId, conversation) {
  return await Message.findOne({
    where: {
      [Op.and]: [
        { senderId: userId },
        { seen: true },
        { conversationId: conversation.id }
      ]
    },
    order: [["createdAt", "DESC"]]
  });
};
Message.numberOfUnreadMessagesInConversation = async function (conversation) {
  return await Message.count({
    where: {
      [Op.and]: [
        {
          senderId: conversation.otherUser.id
        },
        { seen: false },
        { conversationId: conversation.id }
      ]
    }
  });
};

module.exports = Message;
