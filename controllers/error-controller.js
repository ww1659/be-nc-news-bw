exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    if (res.req.method === "DELETE") {
      res.status(400).send({ msg: "invalid comment id" });
    }
    res.status(400).send({ msg: "Invalid Article Id" });
  } else if (err.code === "42601") {
    res.status(400).send({ msg: "invalid post query" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "invalid query" });
  }
  next(err);
};

exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};

exports.getNonExistentPathError = (req, res, next) => {
  res.status(404).send({ msg: "path does not exist" });
};
