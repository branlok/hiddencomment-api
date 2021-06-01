const {
  getComments,
  postComment,
  getReplies,
  deleteComment,
  getUserAllComments,
} = require("../model").comments;

async function getVideoComments(req, res) {
  let { v, page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }

  let limit = parseInt(size);
  let offset = (page - 1) * size;
  let comments = await getComments(v, { limit, offset });

  console.log(comments);
  res.status(200).json(comments.rows); // no limit right now.
}

async function postVideoComments(req, res) {
  const { uid, commentBody, replyTo, videoId } = req.body;

  if (req.session.uid !== uid) {
    return res.status(400).json({ error: "bad credential", action: "relogin" });
  }
  let comments = await postComment(uid, commentBody, videoId, replyTo);
  res.status(200).json(comments.rows); // no limit right now.
}

async function getVideoReplies(req, res) {
  let { commentID, depth } = req.query;
  let comments = await getReplies(commentID, depth);
  console.log(comments);
  res.status(200).json(comments.rows); // no limit right now.
}

async function deleteVideoComment(req, res) {
  let { commentID } = req.query;
  let comments = await deleteComment(commentID);
  console.log(comments);
  res.status(200).json(comments.rows); // no limit right now.
}

async function getUserComments(req, res) {
  let { page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }

  let limit = parseInt(size);
  let offset = (page - 1) * size;
  let comments = await getUserAllComments(req.session.uid, { limit, offset });
  if (comments.rowCount == 0) {
    return res.status(200).json({ message: "noComments" });
  } else if (comments.rowCount > 0) {
    res.status(200).json(comments.rows); // no limit right now.
  }
}

module.exports = {
  getVideoComments,
  getVideoReplies,
  getUserComments,
  postVideoComments,
  deleteVideoComment,
};
