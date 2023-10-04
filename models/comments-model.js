const db = require("../db/connection");

exports.removeComment = (commentId) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [
      commentId,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment does not exist",
        });
      } else {
        return result.rows;
      }
    });
};
