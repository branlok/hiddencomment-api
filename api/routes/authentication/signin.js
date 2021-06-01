var express = require("express");
var router = express.Router();

const signinController = require("../../controllers").signin;

router.post("/signin", signinController.authenticateUser);

module.exports = router;
