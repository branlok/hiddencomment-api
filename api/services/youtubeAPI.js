const axios = require("axios");

async function validateYT(videoID) {
  var video = {
    id: videoID,
    validate: false,
    title: null,
    thumbnail: null,
    channel: null,
  };

  await axios(
    `https://www.googleapis.com/youtube/v3/commentThreads?videoId=${videoID}&key=AIzaSyDl8H61kHtXX-IxO5l9rAJRX4A_NtKtmII&part=snippet`
  )
    .then((result) => {
    
      return video.reason = "video has comments enabled";
    })
    .catch((err) => {
      //if message contains parameter has disabled comments.
      let reason = err.response.data.error.errors[0].reason;
      console.log(reason, "ayo");
      if (reason == "videoNotFound") {
        video.reason = reason;
        return reason;
      } else if (reason == "commentsDisabled") {
        video.reason = reason;
        video.validate = true;
        return reason;
      } else {
        video.validate = false;
      }
    });

  if (video.reason == "commentsDisabled")
    await axios(
      `https://www.googleapis.com/youtube/v3/videos/?id=${videoID}&part=snippet&key=AIzaSyDl8H61kHtXX-IxO5l9rAJRX4A_NtKtmII`
    )
      .then((res) => {
        video.title = res.data.items[0].snippet.title;
        video.thumbnail = res.data.items[0].snippet.thumbnails.maxres.url;
        video.channel = res.data.items[0].snippet.channelTitle;
      })
      .catch((err) => {
        console.log(err);
        video.validate = false;
      });

  return video;
}

module.exports = {
  validateYT,
};
