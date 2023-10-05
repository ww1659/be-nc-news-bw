const { getUsers, getUserById } = require("../controllers/users-controller");
const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);
userRouter.route("/:username").get(getUserById);

module.exports = userRouter;
