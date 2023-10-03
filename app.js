const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const { getEndpoints } = require("./controllers/endpoints-controller");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postComment,
} = require("./controllers/articles-controller.js");
const {
  getNonExistentPathError,
  psqlErrors,
  customErrors,
  serverErrors,
} = require("./controllers/error-controller");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

// psql errors
app.use(psqlErrors);

//custom errors
app.use(customErrors);

//handle server side errors
app.use(serverErrors);

//non existent path errors
app.all("*", getNonExistentPathError);

module.exports = app;
