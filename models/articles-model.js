const db = require("../db/connection");

exports.fetchArticles = () => {
  const fetchArticleQuery = `
  SELECT article_id, title, topic, author, created_at, votes, article_img_url 
  FROM articles 
  ORDER BY created_at DESC;`;

  return db.query(fetchArticleQuery).then((result) => {
    const articles = result.rows;
    return articles;
  });
};

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
