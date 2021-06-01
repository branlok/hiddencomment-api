const { checkAvailability, insertUser } = require("../model").user;
const {hashPassword} = require("../helpers/bcrypt");
async function addUserToDatabase(req, res) {
  console.log(req.body);

  let { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(422).json({
      status: "failed",
      message:
        "insufficient information",
    });
  } else {
    let userFound = await checkAvailability(username, email);

    if (userFound.rowCount !== 0) {
      return res
        .status(406)
        .json({status: "failed", message: "Username and/or email has already been taken" });
    } else {
      password = await hashPassword(password);
      let results = await insertUser(username, email, password);

      return res.status(201).json({
        status: "success",
        message: "user added to database",
        data: {
          user: results.rows[0],
        },
      });
    }
  }
}

module.exports = {
  addUserToDatabase,
};

//note to self
/*
when do you terminate async functions, and usage of await?
lol bececause i havent run it until now thats why i need to await it to read next.
*/
