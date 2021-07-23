const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const logger = require("morgan");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
const { authentication } = require("./helpers/auth");
const { errorHandler } = require("./helpers/error");
// create store for sessions to persist in database
const sessionStore = new SequelizeStore({ db });

const { json, urlencoded } = express;

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));

app.use(authentication);

// require api routes here after I create them
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

module.exports = { app, sessionStore };
