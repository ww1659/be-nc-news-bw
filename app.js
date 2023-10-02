const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");

app.get("/api/topics", getTopics);

//path doesn't exist error handling
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
