const db = require("../db/connection");

exports.fetchTopics = () => {
  const topicsQuery = `SELECT * FROM topics;`;
  return db.query(topicsQuery).then((result) => {
    return result.rows;
  });
};
