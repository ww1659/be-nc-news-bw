const cors = require("cors");
const express = require("express");
const app = express();
const {
  getNonExistentPathError,
  psqlErrors,
  customErrors,
  serverErrors,
} = require("./controllers/error-controller");
const { apiRouter } = require("./routes/api-router");

app.use(cors());
app.use(express.json());

//ENDPOINTS
app.use("/api", apiRouter);

//ERRORS
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);
app.all("*", getNonExistentPathError);

module.exports = app;
