//validate video id exists
//save to database if it qualifies
//return baseline.
const { validateYT } = require("../services/youtubeAPI");
const {
  createVideoRecord,
  getVideoRecord,
  listRecentlyAdded,
} = require("../model/video.js");
const e = require("express");

async function addVideoToDatabase(req, res) {
  let { v } = req.query;

  let VideoInfo = await validateYT(v);
  if (VideoInfo.ready) {
    const userId = req.session?.uid ? req.session.uid : null;
 
    createVideoRecord(VideoInfo, userId);
    res.status(200).json({ success: VideoInfo });
  } else {
    res.status(400).json({
      message: "Only videos with comments disabled can create sidecomments",
    });
  }
}

async function checkVideoOnDatabase(req, res) {

  let { v } = req.query;

  let pgVideoRecord = await getVideoRecord(v);
  try {
    if (pgVideoRecord.rowCount == 1) {
      //we have a record, return the data back.
      res.status(200).json(pgVideoRecord.rows[0]); //return title, picture if ncessary,
    } else {
      //we don't got a record, need to run check with youtube.
      let videoInfo = await validateYT(v);
      if (videoInfo.validate) {
        //insert into PG
        const uid = req.session?.uid ? req.session.uid : null;
        let insertedResult = await createVideoRecord(videoInfo, uid);
        res
          .status(200)
          .json({ message: "created new record", data: insertedResult });
      } else {
        //Invalid;
        res.status(200).json({ message: videoInfo.reason });
      }
    }
  } catch (err) {
    res.status(400).json({ message: "Server Error" });
  }
}

async function getRecentVideoList(req, res) {
  let list = await listRecentlyAdded();
  console.log(list.rows)
  try {
    if (list.rowCount > 0) {
        console.log("succes");
      return res.status(200).json({ data: list.rows });
    } else {
      return res.status(400).json({ message: "no data found" });
    }
  } catch (err) {
    return res.status(400).json({ message: "Server error" });
  }
}

module.exports = {
  addVideoToDatabase,
  checkVideoOnDatabase,
  getRecentVideoList,
};
