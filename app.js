const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
  updateArticle,
} = require("./controllers/articles-controller.js");
const {
  getNonExistentPathError,
  psqlErrors,
  customErrors,
  serverErrors,
} = require("./controllers/error-controller");
const { deleteCommentById } = require("./controllers/comments-controller");
const { getUsers } = require("./controllers/users-controller");

app.use(express.json());

//ENDPOINTS
app.get("/api", getEndpoints);

//TOPICS
app.get("/api/topics", getTopics);

//ARTICLES
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", updateArticle);

//USERS
app.get("/api/users", getUsers);

//COMMENTS
app.delete("/api/comments/:comment_id", deleteCommentById);

//ERRORS
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);
app.all("*", getNonExistentPathError);

module.exports = app;
