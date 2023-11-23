const { authenticateUser } = require("../controllers/login-controller");
const loginRouter = require("express").Router();

loginRouter.route("/").post(authenticateUser);

module.exports = loginRouter;
