const {
  fetchArticles,
  selectArticle,
  selectCommentsByArticleId,
  enterComment,
  updateArticleVotes,
} = require("../models/articles-model");
const { checkUserExists } = require("../models/users-model");

exports.getArticles = (req, res, next) => {
  const query = req.query;
  fetchArticles(query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return Promise.all([
    selectArticle(article_id),
    selectCommentsByArticleId(article_id),
  ])
    .then((results) => {
      const comments = results[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  const newUser = req.body.username;

  return Promise.all([
    selectArticle(article_id),
    checkUserExists(newUser),
    enterComment(article_id, newComment),
  ])
    .then((result) => {
      const comment = result[2];
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const newVote = req.body;
  return Promise.all([
    updateArticleVotes(article_id, newVote),
    selectArticle(article_id),
  ])
    .then((result) => {
      const updatedArticle = result[0];
      res.status(200).send({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
