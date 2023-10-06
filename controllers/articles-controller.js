const {
  fetchArticles,
  selectArticle,
  selectCommentsByArticleId,
  enterComment,
  updateArticleVotes,
  enterArticle,
  removeArticle,
} = require("../models/articles-model");
const { removeArticleByArticleId } = require("../models/comments-model");
const { enterNewTopic, fetchTopics } = require("../models/topics-model");
const { checkUserExists, enterNewUser } = require("../models/users-model");

exports.getArticles = (req, res, next) => {
  const query = req.query;

  return fetchTopics()
    .then((topics) => {
      return fetchArticles(query, topics);
    })
    .then((articles) => {
      const total_count = articles.length;
      res.status(200).send({ articles, total_count });
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
  const query = req.query;

  return selectArticle(article_id)
    .then(() => {
      return selectCommentsByArticleId(query, article_id);
    })
    .then((comments) => {
      const comment_count = comments.length;
      res.status(200).send({ comments, comment_count });
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

exports.postArticle = (req, res, next) => {
  const postedArticle = req.body;

  enterArticle(postedArticle)
    .then((postedArticle) => {
      return postedArticle;
    })
    .then((newArticle) => {
      return selectArticle(newArticle[0].article_id);
    })
    .then((newArticle) => {
      res.status(201).send({ newArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  return removeArticleByArticleId(article_id)
    .then((removedComments) => {
      return removeArticle(article_id);
    })
    .then((removedArticle) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
