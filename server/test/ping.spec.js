const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app.js");
const User = require("../db/models/user");
const { db } = require("../db/db");
chai.should();
chai.use(chaiHttp);

describe("POST /login", () => {
  it("it should return 200 when logging in with a valid credentials ", (done) => {
    process.env.SESSION_SECRET = "secret";
    chai
      .request(app)
      .post("/auth/login")

      .send({
        username: "thomas",
        password: "123456"
      })
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.token.should.exist;
        done();
      });
  });
  it("it should return an error when logging in with a bad credentials ", (done) => {
    chai
      .request(app)
      .post("/auth/login")
      .send({ username: "wrong", password: "password" })
      .end((err, res) => {
        res.should.have.status(401);

        done();
      });
  });
});

describe("POST /register", () => {
  before(async () => {
    //This is sequelize syntax for postgres. You could just take your mongoose syntax here to delete all users
    await User.destroy({
      where: { username: "test" },
      truncate: { cascade: true }
    });
  });

  it("it should register a new user and return 200", (done) => {
    chai
      .request(app)
      .post("/auth/register")

      .send({
        password: "test123",
        username: "test",
        email: "test@test.com"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.token.should.exist;
        done();
      });
  });
  it("it should return an error if data is invalid", (done) => {
    chai
      .request(app)
      .post("/auth/register")

      .send({
        password: "short",
        username: "test",
        email: "invalid-mail"
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.error.should.exist;
        done();
      });
  });
});
