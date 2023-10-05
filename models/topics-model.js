const db = require("../db/connection");

exports.fetchTopics = () => {
  const topicsQuery = `SELECT * FROM topics;`;
  return db.query(topicsQuery).then((result) => {
    return result.rows;
  });
};

// exports.enterNewTopic = async (newTopic) => {
//   const enterNewTopicQuery = `
//   INSERT INTO topics
//   (slug)
//   VALUES
//   ($1)
//   RETURNING *;
//   `;
//   await db.query(enterNewTopicQuery, [newTopic]).then(({ rows }) => {
//     const newTopic = rows;
//     return newTopic;
//   });
// };
