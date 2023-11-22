exports.psqlErrors = (err, req, res, next) => {
  console.log(err);

  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id" });
  } else if (err.code === "42601") {
    res.status(400).send({ msg: "invalid post query" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "invalid query" });
  } else if (err.code === "42703") {
    res.status(400).send({ msg: "invalid query" });
  } else if (err.code === "2201W") {
    res.status(400).send({ msg: "limit must be a positive number" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "invalid query" });
  } else if (err.code === "23505") {
    res.status(422).send({ msg: "topic already exists" });
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
