const db = require("../db/connection");
const { checkUserExists } = require("../db/seeds/utils");

exports.fetchArticles = () => {
  const fetchArticleQuery = `
  SELECT a.article_id, title, topic, a.author, a.created_at, a.votes, article_img_url, COUNT(comment_id) as comment_count
  FROM articles as a
  LEFT JOIN comments as c
  ON a.article_id = c.article_id
  GROUP BY a.article_id, title, topic, a.author, a.created_at, a.votes, article_img_url
  ORDER BY a.created_at DESC
  ;`;

  return db.query(fetchArticleQuery).then((result) => {
    const articles = result.rows;
    return articles;
  });
};

exports.selectArticle = (articleId) => {
  const selectArticleQuery = `
  SELECT * 
  FROM articles 
  WHERE article_id = $1
  ;`;
  return db.query(selectArticleQuery, [articleId]).then((result) => {
    const article = result.rows;
    if (article.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Article does not exist!",
      });
    } else {
      return article;
    }
  });
};

exports.selectCommentsByArticleId = (articleId) => {
  const getCommentsQuery = `
  SELECT *
  FROM comments as c
  WHERE c.article_id = $1
  ORDER BY c.created_at DESC
  ;`;

  return db.query(getCommentsQuery, [articleId]).then((result) => {
    const comments = result.rows;
    if (comments.length === 0) {
      return { msg: "There are no comments for this article." };
    } else {
      return comments;
    }
  });
};

exports.enterComment = (articleId, newComment) => {
  const { username, body } = newComment;

  const postQuery = `
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
    ;`;

  let validPost = true;
  for (const key in newComment) {
    if (key !== "username" && key !== "body") {
      validPost = false;
    }
  }

  if (username && validPost) {
    return db.query(postQuery, [body, username, articleId]).then((result) => {
      return result.rows;
    });
  } else if (validPost && !username) {
    return Promise.reject({ status: 404, msg: "no username provided" });
  } else if (!validPost) {
    return Promise.reject({ status: 404, msg: "invalid post" });
  }
};

exports.updateArticleVotes = (articleId, newVote) => {
  const votes = newVote.incVotes;

  const patchQuery = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  ;`;

  let validPatch = true;
  for (const key in newVote) {
    if (key !== "incVotes") {
      validPatch = false;
    }
  }

  if (votes && validPatch) {
    return db.query(patchQuery, [votes, articleId]).then(({ rows }) => {
      return rows;
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
