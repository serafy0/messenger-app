const onlineUsers = require("../onlineUsers");
const Message = require("../db/models/message");

async function conversationToJSON(convo, userId) {
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
  convoJSON.unreadCount = await Message.numberOfUnreadMessagesInConversation(
    convoJSON
  );

  const lastMessageSeen = await Message.findLastMessageSeen(userId, convoJSON);

  if (lastMessageSeen) {
    convoJSON.idOfLastMessageSeen = lastMessageSeen.id;
  }

  return convoJSON;
}

module.exports = { conversationToJSON };
