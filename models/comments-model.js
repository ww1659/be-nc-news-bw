const db = require("../db/connection");

exports.removeComment = (commentId) => {
  return db
    .query(
      `
    DELETE FROM comments 
    WHERE comment_id = $1 
    RETURNING *
    ;`,
      [commentId]
    )
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

exports.selectComment = (commentId) => {
  const selectCommentQuery = `
  SELECT *
  FROM comments
  WHERE comment_id = $1
  ;`;

  return db.query(selectCommentQuery, [commentId]).then((result) => {
    const comment = result.rows;
    if (comment.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "comment does not exist",
      });
    } else {
      return comment;
    }
  });
};

exports.updateCommentVotes = (commentId, newVote) => {
  const votes = newVote.incVotes;

  const patchQuery = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  ;`;

  let validPatch = true;
  for (const key in newVote) {
    if (key !== "incVotes") {
      validPatch = false;
    }
  }

  if (votes && validPatch) {
    return db.query(patchQuery, [votes, commentId]).then((response) => {
      const updatedComment = response.rows;
      return updatedComment;
    });
  } else if (validPatch && !votes) {
    return Promise.reject({ status: 404, msg: "no incVotes provided" });
  } else if (!validPatch) {
    return Promise.reject({
      status: 404,
      msg: "invalid patch: can only send the property incVotes",
    });
  }
};
