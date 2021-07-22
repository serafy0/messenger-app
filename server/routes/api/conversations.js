const router = require("express").Router();
const {
  readConversation,
  getConversations
} = require("../../controllers/conversation");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", getConversations);

router.put("/read", readConversation);

module.exports = router;
