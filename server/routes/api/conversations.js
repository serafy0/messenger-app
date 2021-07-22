const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId
        }
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId
            }
          },
          attributes: ["id", "username", "photoUrl"],
          required: false
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId
            }
          },
          attributes: ["id", "username", "photoUrl"],
          required: false
        }
      ]
    });
    for (let i = 0; i <= conversations.length - 1; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      convoJSON.messages.reverse();
      convoJSON.unreadCount = await Message.count({
        where: {
          [Op.and]: [
            {
              senderId: convoJSON.otherUser.id
            },
            { seen: false },
            { conversationId: convoJSON.id }
          ]
        }
      });

      const lastMessageSeen = await Message.findOne({
        where: {
          [Op.and]: [
            { senderId: userId },
            { seen: true },
            { conversationId: convoJSON.id }
          ]
        },
        order: [["createdAt", "DESC"]]
      });

      if (lastMessageSeen) {
        convoJSON.idOfLastMessageSeen = lastMessageSeen.id;
      }
      conversations[i] = convoJSON;
    }
    res.json(conversations.reverse());
  } catch (error) {
    next(error);
  }
});

router.put("/read", async (req, res) => {
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

  const seenMessages = await Message.update(
    { seen: true },
    {
      where: {
        [Op.and]: [
          { conversationId: conversationId },
          { senderId: { [Op.not]: userId } },
          { seen: false }
        ]
      },
      returning: true
    }
  );

  return res.sendStatus(204);
});

module.exports = router;
