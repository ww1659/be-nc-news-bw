const endPoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  delete endPoints[Object.keys(endPoints)[0]];
  res.status(200).send({ endPoints });
};
