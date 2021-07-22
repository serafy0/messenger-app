const router = require("express").Router();
const { register, login, getUser, logout } = require("../../controllers/auth");

router.post("/register", register);

router.post("/login", login);

router.delete("/logout", logout);

router.get("/user", getUser);

module.exports = router;
