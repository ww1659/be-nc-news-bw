const { fetchTopics, enterNewTopic } = require("../models/topics-model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;
  enterNewTopic(newTopic)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch((err) => {
      next(err);
    });
};
