const {
  removeComment,
  updateCommentVotes,
  selectComment,
} = require("../models/comments-model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateCommentByVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const newVote = req.body;
  return Promise.all([
    updateCommentVotes(comment_id, newVote),
    selectComment(comment_id),
  ])
    .then((results) => {
      const updatedComment = results[0];
      res.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};
