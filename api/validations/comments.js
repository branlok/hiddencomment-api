const yup = require("yup");

module.exports = yup.object().shape({
  uid: yup.number().positive().integer().required(),
  commentBody: yup.string().max(500).trim().required(),
  videoId:  yup.string().max(50).required(),
  replyTo: yup.number().positive().integer().nullable().default(null),
});
 