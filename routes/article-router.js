const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  updateArticle,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles-controller");
const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticle)
  .delete(deleteArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articleRouter;
