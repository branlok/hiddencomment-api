const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function unHashPassword(DBpassword, incomingPassword) {
    return await bcrypt.compare(DBpassword, incomingPassword)
}



module.exports = {
  hashPassword,
  unHashPassword
};
