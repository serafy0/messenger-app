const jwt = require("jsonwebtoken");
const User = require("../db/models/user");

function authentication(req, res, next) {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next();
      }
      User.findOne({
        where: { id: decoded.id }
      }).then((user) => {
        req.user = user;
        return next();
      });
    });
  } else {
    return next();
  }
}

module.exports = { authentication };
