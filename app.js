require("dotenv").config();
const express = require("express");
const db = require("./db");

var signupRouter = require("./api/routes/authentication/signup");
var signinRouter = require("./api/routes/authentication/signin");
var signoutRouter = require("./api/routes/authentication/signout");
var videoRouter = require("./api/routes/video/video");
var commentsRouter = require("./api/routes/comments/comments");

var session = require("express-session");
var pgSession = require("connect-pg-simple")(session);
var cors = require("cors");

const app = express();

// app.set("trust proxy", 1);
// (async () => {
//   console.log(db.query("SELECT * FROM users;"));
// })();

app.use(
  cors({
    origin: "https://stoic-nightingale-8bf870.netlify.app",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new pgSession({ pool: db.pool }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      sameSite: "none", //this needs to be removed for local
      httpOnly: true,
      secure: true, //this needs to be remove for local
      maxAge: 303 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/watch", videoRouter);

app.use("/authentication", signupRouter);
app.use("/authentication", signinRouter);
app.use("/authentication", signoutRouter);
app.use("/authentication", signoutRouter);

app.use("/comments", commentsRouter);

app.use(function (req, res, next) {
  res.status(404).send({ error: "Not found" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is up listening on port ${port}...`);
});
