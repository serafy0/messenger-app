const router = require("express").Router();
const { postMessage } = require("../../controllers/message");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", postMessage);

module.exports = router;
