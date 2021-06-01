// const { query } = require("../../db");
const db = require("../../db");

exports.getComments = async function (videoId, paginationOption) {
  return await db.query(
    "SELECT comments.*, username  FROM comments INNER JOIN users ON comments.user_id = users.user_id WHERE video_id = $1 AND reply_to IS NULL ORDER BY comments.created_on desc LIMIT $2 OFFSET $3;",
    [videoId, paginationOption.limit, paginationOption.offset]
  );
};

exports.getUserAllComments = async function (userID, paginationOption) {
  return await db.query(
    "SELECT comments.*, videos.thumbnail, videos.title, users.username FROM comments INNER JOIN users ON comments.user_id = users.user_id INNER JOIN videos ON comments.video_id = videos.video_id WHERE comments.user_id = $1 ORDER BY comments.created_on desc LIMIT $2 OFFSET $3;;",
    [userID, paginationOption.limit, paginationOption.offset]
  );
};

exports.getReplies = async function (commentID, depth) {
  commentID = parseInt(commentID);
  console.log(commentID);
  //use common expression table to get nested comments,
  //inner join to get username
  //capture only children comments
  return await db.query(
    `
    WITH RECURSIVE cte (created_on, num_of_replies, comment_id, body, video_id, user_id, path, reply_to, depth)  AS (
        SELECT  created_on, 
        num_of_replies, 
        comment_id,
            body,
            video_id, 
            user_id,
            array[comment_id] AS path,
            reply_to,
            1 AS depth
        FROM    comments
        WHERE   reply_to IS NULL
    
        UNION ALL
    
        SELECT  
        comments.created_on, 
        comments.num_of_replies, 
        comments.comment_id,
            comments.body,
            comments.video_id,
            comments.user_id,
            cte.path || comments.comment_id,
            comments.reply_to,
            cte.depth + 1 AS depth
        FROM    comments
        JOIN cte ON comments.reply_to = cte.comment_id
        )
        SELECT comment_id, body, num_of_replies, cte.user_id, cte.created_on,  users.username, video_id, path, depth FROM cte
    INNER JOIN users ON cte.user_id = users.user_id      
      WHERE path @> Array[$1]::integer[] AND depth = $2
      ORDER BY path;
      `,
    [commentID, depth]
  );
};

exports.postComment = async function (uid, message, videoId, replyTo = null) {
  if (replyTo) {
    //if reply is null, we want to also increment parent comment count.
    return await db
      .query(
        "UPDATE comments SET num_of_replies = num_of_replies + 1 WHERE comment_id = $1",
        [replyTo]
      )
      .then(() => {
        console.log(message, uid, videoId, replyTo);
        return db.query(
          "INSERT INTO comments(body, created_on, user_id, video_id, reply_to) VALUES($1, now(), $2,  $3, $4)",
          [message, uid, videoId, replyTo]
        );
      });
  } else {
    return await db.query(
      "INSERT INTO comments(body, created_on, user_id, video_id, reply_to) VALUES($1, now(), $2,  $3, $4)",
      [message, uid, videoId, replyTo]
    );
  }
};

exports.deleteComment = async function (commentID) {
  return await db
    .query("SELECT reply_to FROM comments WHERE comment_id = $1", [commentID])
    .then((res) => {
      console.log(res, "re");
      if ((res.rowCount = 1 && res.rows[0])) {
        return db.query(
          "UPDATE comments SET num_of_replies = num_of_replies - 1 WHERE comment_id = $1",
          [res.rows[0].reply_to]
        );
      } else {
        throw Error("somethign wrong");
      }
    })
    .then(() => {
      return db.query(
        `DELETE FROM comments 
        WHERE comment_id = $1 RETURNING *`,
        [commentID]
      );
    })
    .then((res) => {
      console.log(res.rows);
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};
