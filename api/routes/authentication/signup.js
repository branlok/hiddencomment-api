var express = require("express");
var router = express.Router();

const signupController = require("../../controllers").signup;

router.post("/signup", signupController.addUserToDatabase);

module.exports = router;
