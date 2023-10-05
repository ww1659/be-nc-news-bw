const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  updateArticle,
} = require("../controllers/articles-controller");
const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles);

articleRouter.route("/:article_id").get(getArticleById).patch(updateArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
