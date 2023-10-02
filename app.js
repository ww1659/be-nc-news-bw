const { readFile } = require("fs/promises");
const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");

app.get("/api/topics", (req, res) => {
  readFile("./endpoints.json").then((file) => {
    const endPoints = JSON.parse(file);
    res.status(200).send({ endPoints });
  });
});

//path doesn't exist error handling
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
