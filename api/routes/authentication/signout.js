var express = require("express");
var router = express.Router();

const signoutController = require("../../controllers").signout;

router.get("/signout", signoutController.signout);

module.exports = router;
