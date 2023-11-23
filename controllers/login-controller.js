const users = require("../db/data/test-data/users");
const { checkValidUser } = require("../models/users-model");

exports.authenticateUser = (req, res, next) => {
  const userInput = req.body;
  const inputName = userInput.name;
  const inputUsername = userInput.username;

  return checkValidUser(inputName, inputUsername)
    .then((user) => {
      res.status(200).send({ valid: true, user: user });
    })
    .catch((err) => {
      next(err);
    });
};
