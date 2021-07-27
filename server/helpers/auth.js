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

function socketAuth(socket, next) {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(
      socket.handshake.auth.token,
      process.env.SESSION_SECRET,
      function (err, decoded) {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    socket.disconnect();
  }
}

module.exports = { authentication, socketAuth };
