const { checkAvailability } = require("../model").user;
const { unHashPassword } = require("../helpers/bcrypt");
async function authenticateUser(req, res) {
  let { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ message: "must provide both username and password" });
    return;
  }
  let userCredential = await checkAvailability(username);

  if (userCredential.rowCount == 1) {
    let dbPassword = userCredential.rows[0].password;
    let exist = await unHashPassword(password, dbPassword);
    if (exist) {
      req.session.auth = "authorized";
      req.session.uid = userCredential.rows[0].user_id;
      req.session.username = userCredential.rows[0].username;
      console.log(userCredential);
      res.status(200).send({
        status: "successfully logged in",
        user: {
          username: userCredential.rows[0].username,
          uid: userCredential.rows[0].user_id,
        },
      });
    } else {
      res.status(400).json({ message: "Wrong user credentials" });
    }
  } else {
    console.log("username does not exist");
    res.status(400).json({ message: "Wrong user credentials" });
  }
}

module.exports = {
  authenticateUser,
};
