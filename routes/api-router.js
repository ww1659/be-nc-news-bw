const { getEndpoints } = require("../controllers/endpoints-controller");
const apiRouter = require("express").Router();
const articleRouter = require("./article-router");
const commentsRouter = require("./comment-router");
const topicRouter = require("./topic-router");
const userRouter = require("./user-router");
const loginRouter = require("./login-router");

apiRouter.get("/", getEndpoints);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/login", loginRouter);

module.exports = { apiRouter };
