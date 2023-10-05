const {
  deleteCommentById,
  updateCommentByVotes,
} = require("../controllers/comments-controller");
const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentByVotes)
  .delete(deleteCommentById);

module.exports = commentsRouter;

// Should:
//     be available on /api/comments/:comment_id.
//     update the votes on a comment given the comment's comment_id.

// Request body accepts:
//     an object in the form { inc_votes: newVote }:

// newVote will indicate how much the votes property in the database should be updated by, e.g.
// { inc_votes : 1 } would increment the current comment's vote property by 1
// { inc_votes : -1 } would decrement the current comment's vote property by 1

// Responds with:
//     the updated comment.
