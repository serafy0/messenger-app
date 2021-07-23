const onlineUsers = require("../onlineUsers");
const User = require("../db/models/user");

async function searchUsers(req, res, next) {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { username } = req.params;

    const users = await User.searchUsers(req.user.id, username);

    // add online status to each user that is online
    for (let i = 0; i < users.length; i++) {
      const userJSON = users[i].toJSON();
      if (onlineUsers.get(userJSON.id)) {
        userJSON.online = true;
      }
      users[i] = userJSON;
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
}

module.exports = { searchUsers };
