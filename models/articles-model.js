const db = require("../db/connection");

exports.selectArticle = (articleId) => {
  const selectArticleQuery = `SELECT * FROM articles WHERE article_id = $1;`;
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
