const db = require("../../db");

exports.createVideoRecord = async function (videoInfo, uid) {
  try {
    //check constraints
    return await db.query(
      "INSERT INTO videos(video_id, title, thumbnail, channel, user_id, created_on) VALUES($1, $2, $3, $4, $5, now()) RETURNING *;",
      [
        videoInfo.id,
        videoInfo.title,
        videoInfo.thumbnail,
        videoInfo.channel,
        uid,
      ]
    );
  } catch (err) {
    console.log("selectUser Error:", err);
  }
};

exports.getVideoRecord = async function (videoID) {
  try {
    //check constraints
    return await db.query("SELECT * FROM  videos WHERE video_id = $1", [
      videoID,
    ]);
  } catch (err) {
    console.log("selectUser Error:", err);
  }
};

exports.listRecentlyAdded = async function (videoID) {
  try {
    //check constraints
    return await db.query("SELECT * FROM videos ORDER BY created_on desc LIMIT 15;");
  } catch (err) {
    console.log("selectUser Error:", err);
  }
};

//   var video = {
//     id: videoID,
//     validate: false,
//     title: null,
//     thumbnail: null,
//     channel: null,
//   };
