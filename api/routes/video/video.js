var express = require("express");
var router = express.Router();
var videoController = require("../../controllers/index").video;

router.post("/", videoController.addVideoToDatabase);
router.get("/", videoController.checkVideoOnDatabase);

router.get("/list", videoController.getRecentVideoList);

module.exports = router;
