const db = require("../db/connection");

exports.fetchUsers = () => {
  const fetchUsersQuery = `
  SELECT * FROM users;`;

  return db.query(fetchUsersQuery).then((result) => {
    const users = result.rows;
    return users;
  });
};

exports.selectUser = (username) => {
  const selectUserQuery = `
  SELECT * 
  FROM users
  WHERE username = $1
  ;`;

  return db.query(selectUserQuery, [username]).then((result) => {
    const user = result.rows;
    if (user.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "user does not exist",
      });
    }
    return user;
  });
};

exports.checkUserExists = async (username) => {
  const checkUserExistsQuery = `SELECT * FROM users WHERE username = $1;`;
  const newUserExists = await db.query(checkUserExistsQuery, [username]);

  if (newUserExists.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }
  return newUserExists;
};

// const newUserQuery = `
//     //   INSERT INTO users
//     //   (username, name, avatar_url)
//     //   VALUES
//     //   ($1, $2, $3)
//     //   RETURNING *
//     //   ;`;
//     // return db.query(newUserQuery, [username, name, avatar_url]);
