const { off } = require("../app");
const db = require("../db/connection");
const { forEach } = require("../db/data/test-data/articles");
const { checkUserExists } = require("../db/seeds/utils");
const format = require("pg-format");

exports.fetchArticles = (query, topics) => {
  const validSortBys = {
    article_id: "article_id",
    title: "title",
    topic: "topic",
    author: "author",
    created_at: "created_at",
    votes: "votes",
    article_img_url: "article_img_url",
    comment_count: "comment_count",
  };
  const validOrderBys = {
    asc: "ASC",
    ASC: "ASC",
    desc: "DESC",
    DESC: "DESC",
  };
  const validTopics = topics.map((topic) => topic.slug);

  let isValidQuery = false;
  for (const key in query) {
    if (
      key === "sort_by" ||
      key === "order" ||
      key === "topic" ||
      key === "p" ||
      key === "limit"
    ) {
      isValidQuery = true;
    }
  }

  const isValidTopic = validTopics.includes(query.topic);

  let limit = 10;
  if (query.limit && query.limit !== null) {
    limit = query.limit;
  }
  let offset = 0;
  if (query.p && query.p !== null) {
    offset = (query.p - 1) * limit;
  }

  const baseQuery = `
  SELECT a.article_id, title, topic, a.author, a.created_at, a.votes, article_img_url, 
  COUNT(comment_id) as comment_count, COUNT(*) OVER() AS full_count
  FROM articles as a
  LEFT JOIN comments as c
  ON a.article_id = c.article_id`;
  const groupByQuery = `
  GROUP BY a.article_id`;
  const limitQuery = `
  LIMIT ${limit}
  OFFSET ${offset};`;

  let fetchArticlesQuery = `${baseQuery}`;
  if (query.topic && isValidTopic) {
    fetchArticlesQuery += ` WHERE a.topic = '${query.topic}'`;
  }
  fetchArticlesQuery += `${groupByQuery} ORDER BY`;
  if (query.sort_by) {
    if (validSortBys[query.sort_by]) {
      fetchArticlesQuery += ` ${query.sort_by}`;
    } else {
      return Promise.reject({ status: 404, msg: "invalid sort_by parameter" });
    }
  } else {
    fetchArticlesQuery += ` created_at`;
  }
  if (query.order) {
    if (validOrderBys[query.order]) {
      fetchArticlesQuery += ` ${query.order}`;
    } else {
      return Promise.reject({ status: 404, msg: "invalid order parameter" });
    }
  } else {
    fetchArticlesQuery += ` DESC`;
  }
  fetchArticlesQuery += `${limitQuery}`;

  if (isValidQuery || Object.keys(query).length === 0) {
    return db.query(fetchArticlesQuery).then((result) => {
      const articles = result.rows;
      return articles;
    });
  } else {
    return Promise.reject({
      status: 404,
      msg: "path does not exist",
    });
  }
};

exports.selectArticle = (articleId) => {
  const selectArticleQuery = `
  SELECT a.article_id, title, topic, a.author, a.created_at, a.votes, article_img_url, a.body, COUNT(comment_id) as comment_count
  FROM articles as a
  LEFT JOIN comments as c
  ON a.article_id = c.article_id
  WHERE a.article_id = $1
  GROUP BY a.article_id
  ORDER BY a.created_at DESC
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

exports.selectCommentsByArticleId = ({ limit = 10, p }, articleId) => {
  let offset = 0;
  if (typeof p === "number" && p > 0) {
    offset = (query.p - 1) * limit;
  }

  if (limit === "0") {
    return Promise.reject({ status: 400, msg: "limit must be greater than 0" });
  }

  const getCommentsQuery = `
  SELECT *
  FROM comments as c
  WHERE c.article_id = $1
  ORDER BY c.created_at DESC
  LIMIT ${limit}
  OFFSET ${offset}
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

exports.enterArticle = (newArticle) => {
  let validPost = true;
  for (const key in newArticle) {
    if (
      key !== "author" &&
      key !== "title" &&
      key !== "body" &&
      key !== "topic" &&
      key !== "article_img_url"
    ) {
      validPost = false;
    }
  }
  if (!validPost) {
    return Promise.reject({ status: 400, msg: "invalid post query" });
  }

  const newArticleValues = [];
  for (const key in newArticle) {
    newArticleValues.push(newArticle[key]);
  }

  const postArticleQuery = format(
    `
    INSERT INTO articles
    (author, title, body, topic, article_img_url)
    VALUES
    (%L)
    RETURNING *
    ;`,
    newArticleValues
  );

  return db.query(postArticleQuery).then((result) => {
    return result.rows;
  });
};

exports.removeArticle = (articleId) => {
  const removeArticleQuery = `
  DELETE FROM articles 
  WHERE article_id = $1 
  RETURNING *
  ;`;

  return db.query(removeArticleQuery, [articleId]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "article does not exist",
      });
    } else {
      return result.rows;
    }
  });
};
