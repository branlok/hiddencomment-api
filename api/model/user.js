const db = require("../../db");

exports.checkAvailability = async function (username, email) {
  try {
    //check constraints
    return await db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
  } catch (err) {
    console.log("selectUser Error:", err);
  }
};

exports.selectUser = async function (username, password) {
  try {
    return await db.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
  } catch (err) {
    console.log("selectUser Error:", err);
  }
};

exports.retrievePassword = async function (username) {
  try {
    return await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
  } catch (err) {
    console.log("selectUser Error:", err);
  }
};

exports.insertUser = async function (username, email, password) {
  try {
    return await db.query(
      "INSERT INTO users (username, password, email, created_on) values ($1, $2, $3, now()) returning *",
      [username, password, email]
    );
  } catch (err) {
    console.log("insertUser Error", err);
  }
};
