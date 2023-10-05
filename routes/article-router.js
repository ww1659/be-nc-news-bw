const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  updateArticle,
  postArticle,
} = require("../controllers/articles-controller");
const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter.route("/:article_id").get(getArticleById).patch(updateArticle);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
