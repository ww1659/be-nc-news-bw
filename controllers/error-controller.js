exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Article Id" });
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
