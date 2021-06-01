var express = require("express");
var router = express.Router();
var validateDto = require("../../middlewares/validate-dto");
var comments = require("../../validations/comments");

const CommentsController = require("../../controllers/index").comments;

router.get("/", CommentsController.getVideoComments);
router.post("/", validateDto(comments), CommentsController.postVideoComments);
router.delete("/", CommentsController.deleteVideoComment);

router.get("/own", CommentsController.getUserComments);

router.get("/replies", CommentsController.getVideoReplies);

module.exports = router;
