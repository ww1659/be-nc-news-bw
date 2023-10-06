const db = require("../db/connection");

exports.fetchTopics = () => {
  const topicsQuery = `SELECT * FROM topics;`;
  return db.query(topicsQuery).then((result) => {
    return result.rows;
  });
};

exports.enterNewTopic = (newTopic) => {
  let validPost = true;
  for (const key in newTopic) {
    if (key !== "slug" && key !== "description") {
      validPost = false;
    }
  }
  if (!validPost) {
    return Promise.reject({ status: 400, msg: "invalid post" });
  }

  const enterNewTopicQuery = `
  INSERT INTO topics
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *;
  `;
  return db
    .query(enterNewTopicQuery, [newTopic.slug, newTopic.description])
    .then(({ rows }) => {
      const newTopic = rows;
      return newTopic;
    });
};
