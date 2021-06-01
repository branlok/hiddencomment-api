// require("dotenv").config();
// const express = require("express");
// const db = require("./db");

// //START SETUP------------------------------------------
// var session = require("express-session");
// var pgSession = require("connect-pg-simple")(session);
// var cors = require("cors");

// const app = express(); //create an instance;

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

// app.use(
//   session({
//     store: new pgSession({ pool: db.pool }),
//     secret: "secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       sameSite: true,
//       httpOnly: true,
//       secure: false,
//       maxAge: 303 * 24 * 60 * 60 * 1000,
//     }, //30days
//   })
// );

// app.use(express.json());
// //END SETUP------------------------------------------

// app.post("/addUser", async (req, res, next) => {
//   try {
//     if (!req.body.username || !req.body.password || !req.body.email) {
//       console.log("fail");
//       res.status(400).send({ message: "Please pass username/email/password." });
//     } else {
//       const checkAvaliable = await db.query(
//         "SELECT * FROM accounts WHERE username = $1 OR email = $2",
//         [req.body.username, req.body.email]
//       );
//       console.log(checkAvaliable.rowCount);
//       if (checkAvaliable.rowCount !== 0) {
//         return res
//           .status(401)
//           .send({ message: "Username or Email has already taken" });
//       }

//       const results = await db.query(
//         "INSERT INTO accounts (username, password, email, created_on) values ($1, $2, $3, now()) returning *",
//         [req.body.username, req.body.password, req.body.email]
//       );
//       res.status(201).json({
//         status: "success",
//         data: {
//           user: results.rows[0],
//         },
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).send();
//   }
// });

// app.post("/signin", async (req, res) => {
//   try {
//     if (req.session.auth) {
//       //if we already have a session// dont do anything.
//       res.status(201).json({
//         status: "success",
//         message: "Already logged into a session",
//       });
//     } else {
//       //we dont have a session lets add this user to our database.
//       //verify user is in the database
//       const results = await db.query(
//         "SELECT * FROM accounts WHERE email = $1 AND password = $2",
//         [req.body.email, req.body.password]
//       );
//       if (results.rows[0]) {
//         req.session.auth = true;
//         res.status(200).json({
//           status: "success",
//           message: "logged in",
//         });
//       } else {
//         res.status(200).json({
//           status: "failed",
//           message: "failed to authenticate user",
//         });
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/signout", (req, res) => {
//   try {
//     req.session.destroy();
//     console.log("test");
//     res.status(200).json({
//       status: "success",
//       message: "logged off",
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// // if (req.session.page_views) {
// //   console.log(req.session.page_views, "yo"); //its pulling from databse not from client side.
// //   req.session.page_views++;
// //   res.send("You visited this page " + req.session.page_views + " times");
// // } else {
// //   req.session.page_views = 1;
// //   res.send("Welcome to this page for the first time!");
// // }

// //get all resturants
// app.get("/api/v1/restaurants", async (req, res) => {
//   try {
//     const results = await db.query("SELECT * FROM restaurants;");
//     console.log(results);
//     req.session.isAuth = true;
//     res.status(200).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         restaurants: results.rows,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/api/v1/restaurants/:id", async (req, res) => {
//   try {
//     //template string is bad, varualble to sql injection attacks. Use a paramterized query instead.
//     const results = await db.query(`SELECT * FROM restaurants WHERE id = $1`, [
//       req.params.id,
//     ]);
//     res.status(200).json({
//       status: "success",
//       results: results.rows.length,
//       data: {
//         restuarants: results.rows,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.post("/api/v1/restaurants", async (req, res) => {
//   try {
//     const results = await db.query(
//       "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *",
//       [req.body.name, req.body.location, req.body.price_range]
//     );
//     console.log(results.body);
//     res.status(201).json({
//       status: "success",
//       data: {
//         restuarants: results.rows,
//       },
//     });
//   } catch (err) {
//     console.log(err, "what");
//   }
// });

// app.put("/api/v1/restaurants/:id", async (req, res) => {
//   try {
//     const results = await db.query(
//       "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
//       [req.body.name, req.body.location, req.body.price_range, req.params.id]
//     );
//     res.status(200).json({
//       status: "success",
//       data: {
//         restuarants: results.rows,
//       },
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.delete("/api/v1/restaurants/:id", async (req, res) => {
//   try {
//     const results = await db.query("DELETE FROM restaurants WHERE id = $1", [
//       req.params.id,
//     ]);
//     res.status(204).json({
//       status: "success",
//     });
//     console.log(results);
//   } catch (err) {
//     console.log(err);
//   }
// });

// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`server is up listening on port ${port}`);
// });

// //use environement variables.
