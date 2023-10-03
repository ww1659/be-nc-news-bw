const {
  fetchArticles,
  selectArticle,
  selectCommentsByArticleId,
} = require("../models/articles-model");

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
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
