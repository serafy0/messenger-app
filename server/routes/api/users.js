const router = require("express").Router();
const { searchUsers } = require("../../controllers/user");

// find users by username
router.get("/:username", searchUsers);

module.exports = router;
