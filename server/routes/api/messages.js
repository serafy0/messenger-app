const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const {Op} = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {

      const existingConversation = await Conversation.findByPk(conversationId)
      if(!existingConversation){
        return res.sendStatus(404)
      }
      if (senderId !== existingConversation.user1Id && senderId !== existingConversation.user2Id) {
        return res.sendStatus(403)
      }
      const message = await Message.create({senderId, text, conversationId});
      return res.json({message, sender});
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
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/read",async (req,res)=>{
  const {conversationId} = req.body
  const userId= req.user.id

  if (!req.user) {
    return res.sendStatus(401);
  }

  if(!conversationId){
    return res.sendStatus(403)
  }

  const conversation = await Conversation.findByPk(conversationId)
  if(!conversation){
    return res.sendStatus(403)

  }
  if (userId !== conversation.user1Id && userId !== conversation.user2Id) {
    return res.sendStatus(403)

  }

  const seenMessages =await Message.update({seen:true},

      {
        where: {
          [Op.and]: [
            { conversationId: conversationId },
            { senderId: {[Op.not]:userId }},
            {seen:false}
          ]
        },
        returning:true


      },

)

  return res.sendStatus(204)


})

module.exports = router;
