const db = require("../db/connection");

const checkUserExists = async (username) => {
  const checkUserExistsQuery = `SELECT * FROM users WHERE username = $1;`;
  const newUserExists = await db.query(checkUserExistsQuery, [username]);

  if (newUserExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }
  return newUserExists;
};

module.exports = { checkUserExists };

// const newUserQuery = `
//     //   INSERT INTO users
//     //   (username, name, avatar_url)
//     //   VALUES
//     //   ($1, $2, $3)
//     //   RETURNING *
//     //   ;`;
//     // return db.query(newUserQuery, [username, name, avatar_url]);
