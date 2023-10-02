const { readFile } = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
  readFile("./endpoints.json")
    .then((file) => {
      const endPoints = JSON.parse(file);
      delete endPoints[Object.keys(endPoints)[0]];
      res.status(200).send({ endPoints });
    })
    .catch((err) => {
      next(err);
    });
};
